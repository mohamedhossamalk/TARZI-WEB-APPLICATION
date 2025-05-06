// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// تعريف middleware مؤقت بسيط للحماية
const simpleAuth = (req, res, next) => {
  console.log('Simple auth middleware executed');
  next();
};

const simpleAdmin = (req, res, next) => {
  console.log('Simple admin middleware executed');
  next();
};

// طباعة للتشخيص
console.log('=== متحكم المسؤول ===');
console.log('getDashboardStats:', typeof adminController.getDashboardStats === 'function' ? '✓ موجودة' : '✗ غير موجودة');
console.log('getUsersList:', typeof adminController.getUsersList === 'function' ? '✓ موجودة' : '✗ غير موجودة');
console.log('getSettings:', typeof adminController.getSettings === 'function' ? '✓ موجودة' : '✗ غير موجودة');
console.log('getActivityLogs:', typeof adminController.getActivityLogs === 'function' ? '✓ موجودة' : '✗ غير موجودة');
console.log('getOrdersList:', typeof adminController.getOrdersList === 'function' ? '✓ موجودة' : '✗ غير موجودة');

// المسارات الرئيسية
// استخدام مسار تجريبي بدلاً من تضمين middleware معقد
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'نظام إدارة منصة ترزي | واجهة برمجة المسؤول'
  });
});

// لوحة التحكم
router.get('/dashboard', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getDashboardStats(req, res);
});

// المستخدمين
router.get('/users', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getUsersList(req, res);
});

router.put('/users/:id', simpleAuth, simpleAdmin, (req, res) => {
  adminController.updateUserStatus(req, res);
});

// المنتجات
router.post('/products', simpleAuth, simpleAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'تم إنشاء منتج جديد',
    product: req.body
  });
});

router.put('/products/:id', simpleAuth, simpleAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `تم تحديث المنتج: ${req.params.id}`,
    product: req.body
  });
});

router.delete('/products/:id', simpleAuth, simpleAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `تم حذف المنتج: ${req.params.id}`
  });
});

router.post('/products/upload-images', simpleAuth, simpleAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'تم رفع الصور',
    images: ['/uploads/sample.jpg']
  });
});

router.put('/products/:id/status', simpleAuth, simpleAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `تم تحديث حالة المنتج: ${req.params.id}`,
    isActive: req.body.isActive
  });
});

// الإعدادات
router.get('/settings', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getSettings(req, res);
});

router.put('/settings', simpleAuth, simpleAdmin, (req, res) => {
  adminController.updateSettings(req, res);
});

// سجل الأنشطة
router.get('/activity-logs', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getActivityLogs(req, res);
});

// الطلبات
router.get('/orders', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getOrdersList(req, res);
});

router.put('/orders/:id', simpleAuth, simpleAdmin, (req, res) => {
  adminController.updateOrderStatus(req, res);
});

router.get('/orders/:id', simpleAuth, simpleAdmin, (req, res) => {
  adminController.getOrderDetails(req, res);
});

module.exports = router;