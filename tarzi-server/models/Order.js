const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Measurement',
    required: true
  },
  fabricChoice: {
    type: String,
    required: true
  },
  colorChoice: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'الكمية يجب أن تكون على الأقل 1']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  additionalRequests: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  rating: {
    rate: Number,
    comment: String,
    date: Date
  },
  updatedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// دالة قبل الحفظ لإنشاء رقم الطلب
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `TZ-${year}${month}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
