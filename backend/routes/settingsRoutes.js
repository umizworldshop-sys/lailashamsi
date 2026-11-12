const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth');
const { isCloudinaryConfigured, uploadFileToCloudinary } = require('../config/cloudinary');

let productRoutes = null;
try {
  productRoutes = require('./productRoutes');
} catch {
  // non-fatal if not yet loaded
}

const DEFAULT_SETTINGS = {
  key: 'main',
  saleDiscountPercent: 30,
  saleDiscountType: 'FLAT',
  marqueeItems: [
    'Discover Timeless Pakistani Elegance',
    'Cash on Delivery Across Pakistan',
    '100% Authentic Handcrafted Pure Fabrics',
    'Express Nationwide Delivery',
    'WhatsApp Support: 03174341036'
  ],
  heroSlides: [
    {
      id: 1,
      tag: 'Velvet Formals 2026',
      title: 'Grace in Every Thread',
      subtitle: 'Handcrafted Velvet & Zari Peshwas',
      image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790101/lailashamsi_products/kfbb3t86uhm5nkg5zn9q.jpg',
      fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790101/lailashamsi_products/kfbb3t86uhm5nkg5zn9q.jpg'
    },
    {
      id: 2,
      tag: 'Festive Pret & Couture',
      title: 'Festive Pret & Couture',
      subtitle: 'Pure Chiffon, Fine Lawn & Embroidered Silks',
      image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790095/lailashamsi_products/dp34oped5by7svtpzj7y.jpg',
      fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790095/lailashamsi_products/dp34oped5by7svtpzj7y.jpg'
    },
    {
      id: 3,
      tag: 'Royal Heritage Formals',
      title: 'Timeless Eastern Elegance',
      subtitle: 'Flared Kalidar Silhouettes & Gotta Kinari Work',
      image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790109/lailashamsi_hero/pyxu5ecrkjo7v2lzzchu.jpg',
      fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790109/lailashamsi_hero/pyxu5ecrkjo7v2lzzchu.jpg'
    }
  ]
};

/**
 * @route   GET /api/settings
 * @desc    Get live storefront settings (Sale %, Marquee items, Hero slides)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' }).lean();
    if (!settings) {
      try {
        const created = await SiteSettings.create(DEFAULT_SETTINGS);
        settings = created.toObject();
      } catch {
        settings = DEFAULT_SETTINGS;
      }
    }
    return res.status(200).json({
      success: true,
      settings
    });
  } catch {
    return res.status(200).json({
      success: true,
      settings: DEFAULT_SETTINGS
    });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update storefront settings (Sale %, Marquee items, Hero slides)
 * @access  Protected (Admin only)
 */
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const { saleDiscountPercent, saleDiscountType, marqueeItems, heroSlides } = req.body;
    const updatePayload = {};

    if (saleDiscountPercent !== undefined) {
      const parsedPercent = Math.min(99, Math.max(1, Number(saleDiscountPercent) || 30));
      updatePayload.saleDiscountPercent = parsedPercent;
    }

    if (saleDiscountType !== undefined) {
      const normalizedType = String(saleDiscountType).trim().toUpperCase();
      updatePayload.saleDiscountType = normalizedType === 'UP TO' || normalizedType === 'UPTO' ? 'UP TO' : 'FLAT';
    }

    if (Array.isArray(marqueeItems)) {
      const cleanedMarquee = marqueeItems
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean);
      if (cleanedMarquee.length > 0) {
        updatePayload.marqueeItems = cleanedMarquee;
      }
    }

    if (Array.isArray(heroSlides) && heroSlides.length > 0) {
      const processedSlides = [];
      for (let i = 0; i < heroSlides.length; i++) {
        const s = heroSlides[i];
        if (!s || !s.image) continue;
        let imgUrl = String(s.image).trim();
        if (imgUrl.startsWith('data:image/') && isCloudinaryConfigured) {
          const uploaded = await uploadFileToCloudinary(imgUrl, 'lailashamsi_hero');
          if (uploaded && uploaded.secure_url) {
            imgUrl = uploaded.secure_url;
          }
        }
        processedSlides.push({
          id: i + 1,
          tag: (s.tag || 'Luxury Collection').trim(),
          title: (s.title || 'Grace in Every Thread').trim(),
          subtitle: (s.subtitle || 'Handcrafted Pakistani Eastern Wear').trim(),
          image: imgUrl,
          fallbackImage: s.fallbackImage || imgUrl
        });
      }
      if (processedSlides.length > 0) {
        updatePayload.heroSlides = processedSlides;
      }
    }

    const updated = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { $set: updatePayload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ===================================================================
    // DYNAMIC STOREWIDE SALE LOGIC (FLAT vs UP TO)
    // ===================================================================
    // When FLAT is activated:
    // 1. Every product across the store automatically receives the discount %.
    // 2. The real base price is cut (strikethrough) and stored in originalPrice.
    // 3. The discounted price is calculated and stored in price (e.g. 1000 cut to 900 for 10%).
    // 4. Tag is automatically set to `${percent}% OFF` and isOnSale = true.
    // When switched back to UP TO:
    // Regular base prices are restored, and storewide cuts are cleared.
    const effectiveType = updated.saleDiscountType || 'FLAT';
    const effectivePercent = Math.min(99, Math.max(1, Number(updated.saleDiscountPercent) || 30));

    if (effectiveType === 'FLAT' && effectivePercent > 0) {
      const allProducts = await Product.find({});
      for (const prod of allProducts) {
        // Determine authentic original base price before flat sale
        const baseline = (prod.basePrice && Number(prod.basePrice) > 0)
          ? Number(prod.basePrice)
          : Math.max(Number(prod.price) || 0, Number(prod.originalPrice) || 0);

        if (baseline > 0) {
          const discountAmount = Math.round(baseline * (effectivePercent / 100));
          const finalPrice = Math.max(1, baseline - discountAmount);

          prod.basePrice = baseline;
          prod.originalPrice = baseline;
          prod.price = finalPrice;
          prod.discountPercent = effectivePercent;
          prod.tag = `${effectivePercent}% OFF`;
          prod.isOnSale = true;
          await prod.save();
        }
      }
    } else if (effectiveType === 'UP TO') {
      const flatProducts = await Product.find({ basePrice: { $ne: null } });
      for (const prod of flatProducts) {
        if (prod.basePrice && Number(prod.basePrice) > 0) {
          prod.price = Number(prod.basePrice);
          prod.originalPrice = null;
          prod.discountPercent = 0;
          if (prod.tag && prod.tag.includes('% OFF')) {
            prod.tag = '';
          }
          prod.isOnSale = false;
          prod.basePrice = null;
          await prod.save();
        }
      }
    }

    if (productRoutes && typeof productRoutes.invalidateProductsCache === 'function') {
      productRoutes.invalidateProductsCache();
    }

    return res.status(200).json({
      success: true,
      message: 'Storefront settings updated successfully!',
      settings: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update storefront settings',
      error: error.message
    });
  }
});

module.exports = router;

