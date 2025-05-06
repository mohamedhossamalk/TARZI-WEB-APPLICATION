const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم المنتج'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'يرجى إدخال وصف المنتج']
  },
  price: {
    type: Number,
    required: [true, 'يرجى إدخال سعر المنتج'],
    min: [0, 'يجب أن يكون السعر أكبر من أو يساوي 0']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'يرجى اختيار فئة للمنتج']
  },
  imageUrl: {
    type: String,
    required: [true, 'يرجى تحميل صورة للمنتج']
  },
  images: [String],
  fabricOptions: [String],
  colorOptions: [String],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);