const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: [true, 'يرجى توفير وصف للإجراء']
  },
  entity: {
    type: String,
    required: [true, 'يرجى توفير نوع الكيان'],
    enum: ['user', 'product', 'order', 'measurement', 'service', 'category', 'system']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,  // تم تصحيح هذا السطر
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);