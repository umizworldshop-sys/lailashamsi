const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { verifyAdmin } = require('../middleware/auth');
const { isCloudinaryConfigured, uploadFileToCloudinary } = require('../config/cloudinary');

const DEFAULT_SETTINGS = {
  key: 'main',
  saleDiscountPercent: 30,
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
      image: 'https://jazmin.pk/cdn/shop/files/2C5A5663.png?v=1793342503&width=2000',
      fallbackImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=2000&auto=format&fit=crop'
    },
    {
      id: 2,
      tag: 'Festive Pret & Couture',
      title: 'Festive Pret & Couture',
      subtitle: 'Pure Chiffon, Fine Lawn & Embroidered Silks',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=2000&auto=format&fit=crop',
      fallbackImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=2000&auto=format&fit=crop'
    },
    {
      id: 3,
      tag: 'Royal Heritage Formals',
      title: 'Timeless Eastern Elegance',
      subtitle: 'Flared Kalidar Silhouettes & Gotta Kinari Work',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=85&w=2000&auto=format&fit=crop',
      fallbackImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=85&w=2000&auto=format&fit=crop'
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
    const { saleDiscountPercent, marqueeItems, heroSlides } = req.body;
    const updatePayload = {};

    if (saleDiscountPercent !== undefined) {
      const parsedPercent = Math.min(99, Math.max(1, Number(saleDiscountPercent) || 30));
      updatePayload.saleDiscountPercent = parsedPercent;
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

