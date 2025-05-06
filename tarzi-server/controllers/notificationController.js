const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على الإشعارات غير المقروءة
// @route   GET /api/notifications/unread
// @access  Private
exports.getUnreadNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    userId: req.user.id,
    isRead: false
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications
  });
});

// @desc    الحصول على جميع الإشعارات
// @route   GET /api/notifications
// @access  Private
exports.getAllNotifications = asyncHandler(async (req, res, next) => {
  // عدد العناصر لكل صفحة
  const pageSize = parseInt(req.query.pageSize) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  // عدد الإشعارات الإجمالي
  const total = await Notification.countDocuments({ userId: req.user.id });

  // الحصول على الإشعارات
  const notifications = await Notification.find({ userId: req.user.id })
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    notifications
  });
});

// @desc    وضع علامة كمقروء لإشعار
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!notification) {
    return next(new ErrorResponse(`الإشعار غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'تم وضع علامة كمقروء للإشعار بنجاح',
    notification
  });
});

// @desc    وضع علامة كمقروء لجميع الإشعارات
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'تم وضع علامة كمقروء لجميع الإشعارات بنجاح'
  });
});

// @desc    حذف إشعار
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!notification) {
    return next(new ErrorResponse(`الإشعار غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الإشعار بنجاح'
  });
});

// @desc    إنشاء إشعار (داخلي)
// @access  Private
exports.createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (err) {
    console.error('فشل إنشاء الإشعار:', err);
    return null;
  }
};

// @desc    إشعار متعدد المستلمين (داخلي)
// @access  Private
exports.createMultipleNotifications = async (users, notificationTemplate) => {
  try {
    const notifications = [];
    
    for (const userId of users) {
      const notificationData = {
        userId,
        ...notificationTemplate
      };
      
      const notification = await Notification.create(notificationData);
      notifications.push(notification);
    }
    
    return notifications;
  } catch (err) {
    console.error('فشل إنشاء إشعارات متعددة:', err);
    return [];
  }
};