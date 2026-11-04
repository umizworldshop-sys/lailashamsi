const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: false },
  title: { type: String, required: true },
  category: { type: String, default: '' },
  categoryLabel: { type: String, default: 'Luxury Pret' },
  fabric: { type: String, default: '' },
  pieces: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: 'M' },
  selectedColor: {
    name: { type: String, default: '' },
    hex: { type: String, default: '' }
  },
  image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'Pakistan' },
    deliveryNotes: { type: String, default: '' }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  shippingFee: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  paymentMethod: { type: String, default: 'cod' },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });

module.exports = mongoose.model('Order', orderSchema);
