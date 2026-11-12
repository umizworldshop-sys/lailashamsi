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
    saleDiscountType: {
      type: String,
      default: 'FLAT',
      trim: true
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

