const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema(
  {
    id: { type: Number, default: 1 },
    tag: { type: String, default: 'Luxury Collection' },
    title: { type: String, default: 'Grace in Every Thread' },
    subtitle: { type: String, default: 'Handcrafted Pakistani Eastern Wear' },
    image: { type: String, required: true },
    fallbackImage: { type: String, default: '' }
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      index: true
    },
    saleDiscountPercent: {
      type: Number,
      default: 30,
      min: 1,
      max: 99
    },
    marqueeItems: {
      type: [String],
      default: [
        'Discover Timeless Pakistani Elegance',
        'Cash on Delivery Across Pakistan',
        '100% Authentic Handcrafted Pure Fabrics',
        'Express Nationwide Delivery',
        'WhatsApp Support: 03174341036'
      ]
    },
    heroSlides: {
      type: [heroSlideSchema],
      default: [
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

