const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'يرجى إدخال عنوان الخدمة'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'يرجى إدخال وصف الخدمة']
  },
  price: {
    type: Number,
    required: [true, 'يرجى إدخال سعر الخدمة'],
    min: [0, 'يجب أن يكون السعر أكبر من أو يساوي 0']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'يرجى اختيار فئة للخدمة']
  },
  imageUrl: {
    type: String,
    required: [true, 'يرجى تحميل صورة للخدمة']
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);