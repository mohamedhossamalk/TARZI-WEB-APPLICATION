const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// استخدام وسيط المصادقة لجميع مسارات الإشعارات
router.use(authMiddleware);

// مسارات الإشعارات
router.get('/unread', notificationController.getUnreadNotifications);
router.get('/', notificationController.getAllNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;