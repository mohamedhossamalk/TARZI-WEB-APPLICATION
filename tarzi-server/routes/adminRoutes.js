const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// استخدام وسيط المصادقة ووسيط التحقق من الدور لجميع مسارات المسؤول
router.use(authMiddleware, roleMiddleware('admin'));

// مسارات لوحة التحكم والإحصائيات
router.get('/dashboard', adminController.getDashboardStats);

// مسارات المستخدمين
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/users/:id/role', adminController.changeUserRole);

// مسارات التقارير
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/:reportType/download', adminController.downloadReport);

// سجل الأنشطة
router.get('/activity-log', adminController.getActivityLog);

// إعدادات النظام
router.get('/settings', adminController.manageSystemSettings);
router.put('/settings', adminController.manageSystemSettings);

module.exports = router;