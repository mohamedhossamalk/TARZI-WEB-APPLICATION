const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم الفئة'],
    unique: true,
    trim: true
  },
  description: String,
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// إضافة وظيفة افتراضية لحساب عدد المنتجات
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

module.exports = mongoose.model('Category', categorySchema);