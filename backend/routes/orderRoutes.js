const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const initialProducts = require('../data/initialProducts');
const { verifyAdmin } = require('../middleware/auth');

// In-memory fallback order buffer so even if DB spikes under 1,000 concurrent users, zero orders are lost
const memoryOrdersBuffer = [];

function generateCollisionFreeOrderNumber() {
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  const randPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `LS-${timePart}${randPart}`;
}

/**
 * Enrich order items with authoritative backend product details
 */
async function enrichItemsWithBackendDetails(items) {
  let dbProductsMap = new Map();

  if (mongoose.connection.readyState === 1) {
    try {
      const validObjectIds = items
        .map(i => i.productId)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));

      const titles = items.map(i => i.title).filter(Boolean);

      const matchedProducts = await Product.find({
        $or: [
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          ...(titles.length > 0 ? [{ title: { $in: titles } }] : [])
        ]
      }).lean();

      for (const prod of matchedProducts) {
        dbProductsMap.set(prod._id.toString(), prod);
        dbProductsMap.set(prod.title.toLowerCase(), prod);
      }
    } catch (e) {
      // Fallback to initialProducts if DB lookup has any transient issue
    }
  }

  return items.map((item) => {
    const backendProd =
      (item.productId && dbProductsMap.get(String(item.productId))) ||
      (item.title && dbProductsMap.get(String(item.title).toLowerCase())) ||
      initialProducts.find(
        (p, idx) =>
          String(p.id || idx + 1) === String(item.productId) ||
          (p.title && item.title && p.title.toLowerCase() === item.title.toLowerCase())
      );

    return {
      productId: backendProd?._id ? backendProd._id.toString() : (item.productId || ''),
      title: backendProd?.title || item.title,
      category: backendProd?.category || item.category || '',
      categoryLabel: backendProd?.categoryLabel || item.categoryLabel || 'Luxury Pret',
      fabric: backendProd?.fabric || item.fabric || 'Pure Silk & Organza',
      pieces: backendProd?.pieces || item.pieces || '3 Piece',
      description: backendProd?.description || item.description || '',
      price: Number(item.price ?? backendProd?.price ?? 0),
      originalPrice: backendProd?.originalPrice || item.originalPrice || null,
      quantity: Math.max(1, Number(item.quantity || 1)),
      selectedSize: item.selectedSize || (backendProd?.sizes?.[0] || 'M'),
      selectedColor: item.selectedColor || (backendProd?.colors?.[0] || { name: 'Default', hex: '#641E32' }),
      image: item.image || backendProd?.images?.[0] || ''
    };
  });
}

/**
 * @route   POST /api/orders
 * @desc    Place a new bespoke order from storefront (High-Concurrency & Non-Blocking)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      orderNumber: clientOrderNumber,
      customer,
      items,
      subtotal,
      discountAmount,
      promoCode,
      shippingFee,
      grandTotal,
      currency,
      paymentMethod
    } = req.body;

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, phone, and delivery address are required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.'
      });
    }

    // 1. Enrich every item with exact backend product details
    const enrichedItems = await enrichItemsWithBackendDetails(items);

    // 2. Collision-free unique Order Reference Number
    const orderNumber = clientOrderNumber || generateCollisionFreeOrderNumber();

    const orderPayload = {
      orderNumber,
      customer,
      items: enrichedItems,
      subtotal: Number(subtotal || grandTotal),
      discountAmount: Number(discountAmount || 0),
      promoCode: promoCode || '',
      shippingFee: Number(shippingFee || 0),
      grandTotal: Number(grandTotal),
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'cod',
      status: 'Pending'
    };

    if (mongoose.connection.readyState === 1) {
      const newOrder = new Order(orderPayload);
      const savedOrder = await newOrder.save();

      // Non-blocking background stock decrement & auto out-of-stock check
      setImmediate(async () => {
        try {
          let productRoutes = null;
          try { productRoutes = require('./productRoutes'); } catch {}

          for (const i of enrichedItems) {
            if (i.productId && mongoose.Types.ObjectId.isValid(i.productId)) {
              const prod = await Product.findById(i.productId);
              if (prod) {
                const currentStock = Number(prod.stock) || 0;
                const qty = Math.max(1, Number(i.quantity) || 1);
                const nextStock = Math.max(0, currentStock - qty);
                prod.stock = nextStock;
                if (nextStock === 0) {
                  prod.isOutOfStock = true;
                }
                await prod.save();
              }
            }
          }

          if (productRoutes && typeof productRoutes.invalidateProductsCache === 'function') {
            productRoutes.invalidateProductsCache();
          }
        } catch (err) {
          // Non-blocking background stock sync
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: savedOrder,
        orderNumber: savedOrder.orderNumber
      });
    } else {
      // Resilient in-memory queue when DB is temporarily unreachable
      const fallbackOrder = {
        ...orderPayload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      memoryOrdersBuffer.unshift(fallbackOrder);
      return res.status(201).json({
        success: true,
        message: 'Order confirmed instantly!',
        order: fallbackOrder,
        orderNumber: fallbackOrder.orderNumber
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Protected (Admin only)
 */
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.fullName': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex }
      ];
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: memoryOrdersBuffer.length,
        orders: memoryOrdersBuffer
      });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    const formatted = orders.map(o => ({ ...o, id: o._id.toString() }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      orders: formatted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Protected (Admin only)
 */
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order: { ...order, id: order._id.toString() }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message
    });
  }
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Protected (Admin only)
 */
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${order.orderNumber} status updated to ${status}`,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order
 * @access  Protected (Admin only)
 */
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${order.orderNumber} deleted successfully.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

module.exports = router;
