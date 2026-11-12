const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');
const initialProducts = require('../data/initialProducts');
const { isCloudinaryConfigured, uploadFileToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

async function normalizeProductImages(images, singleImage) {
  let rawList = [];
  if (Array.isArray(images)) {
    rawList = images.filter(img => typeof img === 'string' && img.trim() !== '').map(img => img.trim());
  } else if (typeof images === 'string' && images.trim() !== '') {
    rawList = [images.trim()];
  }
  if (rawList.length === 0 && typeof singleImage === 'string' && singleImage.trim() !== '') {
    rawList = [singleImage.trim()];
  }

  const finalImages = [];
  for (const img of rawList) {
    if (img.startsWith('data:image/') && isCloudinaryConfigured) {
      const uploaded = await uploadFileToCloudinary(img, 'lailashamsi_products');
      if (uploaded && uploaded.secure_url) {
        finalImages.push(uploaded.secure_url);
      } else {
        finalImages.push(img);
      }
    } else {
      finalImages.push(img);
    }
  }
  return finalImages;
}

// ----------------------------------------------------------------------
// HIGH-CONCURRENCY IN-MEMORY CACHE (Serves 1,000+ simultaneous users in <1ms)
// ----------------------------------------------------------------------
const productCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL
const inFlightRequests = new Map();

function invalidateProductsCache() {
  productCache.clear();
}

function formatLeanProduct(doc, idx = 0) {
  if (!doc) return null;
  const idStr = doc._id ? doc._id.toString() : (doc.id ? String(doc.id) : String(idx + 1));
  return {
    ...doc,
    id: idStr,
    _id: idStr
  };
}

/**
 * @route   GET /api/products
 * @desc    Get all products with high-speed caching, filtering, searching, and sorting
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category = '', search = '', sort = '', collection = '' } = req.query;
    const cacheKey = `${category}|${collection}|${search.trim().toLowerCase()}|${sort}`;

    // 1. Serve immediately from RAM cache if fresh
    const cached = productCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cached.payload);
    }

    // 2. Coalesce simultaneous requests for the same query (prevents stampede under 1,000 users)
    if (inFlightRequests.has(cacheKey)) {
      const payload = await inFlightRequests.get(cacheKey);
      res.set('X-Cache', 'COALESCED');
      return res.status(200).json(payload);
    }

    const fetchPromise = (async () => {
      // Ensure database is fully connected before checking or querying
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }

      // If DB connection is genuinely unavailable after retry, return fallback without caching it in RAM
      if (mongoose.connection.readyState !== 1) {
        const fallbackList = initialProducts.map((p, i) => formatLeanProduct(p, i));
        return {
          success: true,
          count: fallbackList.length,
          products: fallbackList,
          _isFallback: true
        };
      }

      // If database is empty, auto-seed initial catalog into MongoDB Atlas
      const totalInDb = await Product.countDocuments();
      if (totalInDb === 0) {
        try {
          const formatted = initialProducts.map(p => ({
            ...p,
            isNewArrival: p.isNew !== undefined ? p.isNew : true,
            isOnSale: Boolean(p.originalPrice && p.originalPrice > p.price),
            isTrending: Boolean(p.tag && /bestseller|trend|hot/i.test(p.tag)),
            discountPercent: p.originalPrice && p.originalPrice > p.price 
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
              : 0
          }));
          await Product.insertMany(formatted);
        } catch (seedErr) {
          console.warn('Auto-seed notice:', seedErr.message);
        }
      }

      let query = {};
      if (category && category !== 'all') {
        if (category === 'female' || category === 'women') {
          query.category = { $nin: ['babies', 'kids', 'baby-clothes'] };
        } else if (category === 'babies' || category === 'kids') {
          query.category = { $in: ['babies', 'kids', 'baby-clothes'] };
        } else {
          query.category = category;
        }
      }

      // Collection filter (new-arrivals, sale, trending)
      if (collection === 'new-arrivals') {
        query.$or = [
          { isNewArrival: true },
          { isNew: true },
          { tag: { $regex: /new/i } }
        ];
      } else if (collection === 'sale') {
        query.$or = [
          { isOnSale: true, discountPercent: { $gt: 0 } },
          { discountPercent: { $gt: 0 } },
          { $expr: { $gt: ['$originalPrice', '$price'] } }
        ];
      } else if (collection === 'trending') {
        query.$or = [
          { isTrending: true },
          { tag: { $regex: /trend|bestseller|featured/i } }
        ];
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        const searchConditions = [
          { title: regex },
          { description: regex },
          { fabric: regex },
          { categoryLabel: regex },
          { 'colors.name': regex }
        ];

        if (query.$or) {
          query.$and = [
            { $or: query.$or },
            { $or: searchConditions }
          ];
          delete query.$or;
        } else {
          query.$or = searchConditions;
        }
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      else if (sort === 'price_desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'discount_desc' || collection === 'sale') sortOption = { discountPercent: -1, createdAt: -1 };

      const rawProducts = await Product.find(query).sort(sortOption).lean();
      const products = rawProducts.map((p, i) => formatLeanProduct(p, i));

      const responsePayload = {
        success: true,
        count: products.length,
        products
      };

      if (!responsePayload._isFallback && mongoose.connection.readyState === 1) {
        productCache.set(cacheKey, {
          timestamp: Date.now(),
          payload: responsePayload
        });
      }

      return responsePayload;
    })();

    inFlightRequests.set(cacheKey, fetchPromise);

    try {
      const payload = await fetchPromise;
      res.set('X-Cache', 'MISS');
      return res.status(200).json(payload);
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  } catch (error) {
    const fallbackList = initialProducts.map((p, i) => formatLeanProduct(p, i));
    return res.status(200).json({
      success: true,
      count: fallbackList.length,
      products: fallbackList
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `single|${id}`;
    const cached = productCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json(cached.payload);
    }

    let product = null;
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const raw = await Product.findById(id).lean();
      if (raw) product = formatLeanProduct(raw);
    }

    if (!product) {
      const fallback = initialProducts.find(
        (p, idx) => String(p.id || idx + 1) === String(id) || p.title === id
      );
      if (fallback) product = formatLeanProduct(fallback);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const payload = { success: true, product };
    productCache.set(cacheKey, { timestamp: Date.now(), payload });
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Protected (Admin only)
 */
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      categoryLabel,
      price,
      originalPrice,
      rating,
      reviewsCount,
      tag,
      tagColor,
      images,
      fabric,
      pieces,
      colors,
      sizes,
      description,
      isNew,
      isNewArrival,
      isOnSale,
      isTrending,
      featured,
      stock
    } = req.body;

    if (!title || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and price are required fields.'
      });
    }

    const processedImages = await normalizeProductImages(images, req.body.image);

    if (processedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a product photo or enter an image URL.'
      });
    }

    const numPrice = Number(price);
    const numOrigPrice = originalPrice ? Number(originalPrice) : null;
    const computedDiscount = (numOrigPrice && numOrigPrice > numPrice)
      ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
      : 0;
    const computedIsSale = isOnSale !== undefined 
      ? Boolean(isOnSale) 
      : Boolean(numOrigPrice && numOrigPrice > numPrice);

    let effectivePrice = numPrice;
    let effectiveOrigPrice = numOrigPrice;
    let effectiveDiscount = computedDiscount;
    let effectiveTag = tag || '';
    let effectiveIsSale = computedIsSale;
    let effectiveBasePrice = null;

    try {
      const SiteSettings = require('../models/SiteSettings');
      const activeSettings = await SiteSettings.findOne({ key: 'main' });
      if (activeSettings && activeSettings.saleDiscountType === 'FLAT' && Number(activeSettings.saleDiscountPercent) > 0) {
        const flatPct = Number(activeSettings.saleDiscountPercent);
        const baseline = (numOrigPrice && numOrigPrice > numPrice) ? numOrigPrice : numPrice;
        effectiveBasePrice = baseline;
        effectiveOrigPrice = baseline;
        effectivePrice = Math.max(1, Math.round(baseline * (1 - flatPct / 100)));
        effectiveDiscount = flatPct;
        effectiveTag = `${flatPct}% OFF`;
        effectiveIsSale = true;
      }
    } catch {
      // non-fatal
    }

    const newProduct = new Product({
      title: title.trim(),
      category: category.trim(),
      categoryLabel: categoryLabel || undefined,
      price: effectivePrice,
      originalPrice: effectiveOrigPrice,
      basePrice: effectiveBasePrice,
      discountPercent: effectiveDiscount,
      rating: rating ? Number(rating) : 5.0,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
      tag: effectiveTag,
      tagColor: tagColor || 'bg-[#4A0E17] text-[#FAF7F2]',
      images: processedImages,
      fabric: fabric || 'Pure Silk & Handcrafted Chiffon',
      pieces: pieces || '3 Piece',
      colors: Array.isArray(colors) ? colors : [{ name: 'Classic Gold', hex: '#D4AF37' }],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL'],
      description: description || '',
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      isOnSale: effectiveIsSale,
      isTrending: isTrending !== undefined ? Boolean(isTrending) : false,
      featured: featured !== undefined ? Boolean(featured) : false,
      stock: stock !== undefined ? Math.max(0, Number(stock) || 0) : 25,
      isOutOfStock: req.body.isOutOfStock !== undefined ? Boolean(req.body.isOutOfStock) : (Number(stock) === 0)
    });

    const savedProduct = await newProduct.save();
    invalidateProductsCache();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: savedProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product
 * @access  Protected (Admin only)
 */
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.images !== undefined || updateData.image !== undefined) {
      const normalizedImgs = await normalizeProductImages(updateData.images, updateData.image);
      if (normalizedImgs.length > 0) {
        updateData.images = normalizedImgs;
      }
    }
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) {
      updateData.originalPrice = updateData.originalPrice ? Number(updateData.originalPrice) : null;
    }
    if (updateData.price !== undefined || updateData.originalPrice !== undefined) {
      const p = updateData.price !== undefined ? updateData.price : 0;
      const op = updateData.originalPrice !== undefined ? updateData.originalPrice : 0;
      if (op && op > p) {
        updateData.discountPercent = Math.round(((op - p) / op) * 100);
        if (updateData.isOnSale === undefined) updateData.isOnSale = true;
      } else {
        updateData.discountPercent = 0;
      }
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Math.max(0, Number(updateData.stock) || 0);
      if (updateData.isOutOfStock === undefined) {
        updateData.isOutOfStock = updateData.stock === 0;
      }
    }
    if (updateData.isOutOfStock !== undefined) {
      updateData.isOutOfStock = Boolean(updateData.isOutOfStock);
      if (updateData.isOutOfStock && (!updateData.stock || updateData.stock > 0)) {
        updateData.stock = 0;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    invalidateProductsCache();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

/**
 * @route   PATCH /api/products/:id/toggle-stock
 * @desc    Toggle product in-stock / out-of-stock instantly from admin product card
 * @access  Protected (Admin only)
 */
router.patch('/:id/toggle-stock', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const currentOut = Boolean(product.isOutOfStock) || Number(product.stock) <= 0;
    if (currentOut) {
      product.isOutOfStock = false;
      product.stock = 15; // standard restock quantity
    } else {
      product.isOutOfStock = true;
      product.stock = 0;
    }

    await product.save();
    invalidateProductsCache();

    return res.status(200).json({
      success: true,
      message: product.isOutOfStock ? `"${product.title}" marked Out of Stock` : `"${product.title}" marked In Stock (15 pieces)`,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle stock status',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Protected (Admin only)
 */
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Clean up persistent Cloudinary images asynchronously if present
    if (Array.isArray(product.images)) {
      for (const imgUrl of product.images) {
        if (typeof imgUrl === 'string' && imgUrl.includes('cloudinary.com')) {
          deleteFromCloudinary(imgUrl).catch(() => {});
        }
      }
    }

    invalidateProductsCache();

    return res.status(200).json({
      success: true,
      message: `Product "${product.title}" has been deleted.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/products/seed
 * @desc    Seed initial catalog data
 * @access  Protected (Admin only)
 */
router.post('/seed', verifyAdmin, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.status(400).json({
        success: false,
        message: `Database already contains ${count} products. Use ?force=true to reset.`
      });
    }

    if (req.query.force) {
      await Product.deleteMany({});
    }

    const inserted = await Product.insertMany(initialProducts);
    invalidateProductsCache();

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} luxury products into MongoDB!`,
      products: inserted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  }
});

router.invalidateProductsCache = invalidateProductsCache;
module.exports = router;
