const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم للمقاس'],
    trim: true
  },
  chest: {
    type: Number,
    required: [true, 'يرجى إدخال قياس الصدر']
  },
  waist: {
    type: Number,
    required: [true, 'يرجى إدخال قياس الخصر']
  },
  hips: {
    type: Number,
    required: [true, 'يرجى إدخال قياس الورك']
  },
  shoulderWidth: {
    type: Number,
    required: [true, 'يرجى إدخال عرض الكتف']
  },
  sleeveLength: {
    type: Number,
    required: [true, 'يرجى إدخال طول الكم']
  },
  inseam: {
    type: Number,
    required: [true, 'يرجى إدخال قياس الداخلي للساق']
  },
  height: {
    type: Number,
    required: [true, 'يرجى إدخال الطول']
  },
  weight: {
    type: Number,
    required: [true, 'يرجى إدخال الوزن']
  },
  notes: String,
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Measurement', measurementSchema);