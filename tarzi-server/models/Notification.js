const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'يرجى إدخال عنوان الإشعار'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'يرجى إدخال محتوى الإشعار']
  },
  type: {
    type: String,
    enum: ['order', 'system', 'auth', 'message', 'service'],
    default: 'system'
  },
  entityId: {
    type: String,
    default: null
  },
  entityType: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);