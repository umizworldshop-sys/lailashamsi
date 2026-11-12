const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true, default: '#000000' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category identifier is required'],
    trim: true
  },
  categoryLabel: {
    type: String,
    default: function() {
      // Auto capitalize category if categoryLabel is not provided
      if (!this.category) return 'Luxury Pret';
      return this.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  basePrice: {
    type: Number,
    default: null
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  tag: {
    type: String,
    default: ''
  },
  tagColor: {
    type: String,
    default: 'bg-[#4A0E17] text-[#FAF7F2]'
  },
  images: {
    type: [String],
    default: []
  },
  fabric: {
    type: String,
    default: 'Pure Organza & Raw Silk'
  },
  pieces: {
    type: String,
    default: '3 Piece'
  },
  colors: {
    type: [colorSchema],
    default: []
  },
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL']
  },
  description: {
    type: String,
    default: ''
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 25,
    min: 0
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

// High-concurrency compound indexes for fast filtering & sorting
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ isNewArrival: 1, category: 1 });
productSchema.index({ isOnSale: 1, discountPercent: -1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ title: 'text', description: 'text', fabric: 'text' });

module.exports = mongoose.model('Product', productSchema);
