const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// مساعد مؤقت لدوال التحكم غير المنفذة بعد
const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'لم يتم تنفيذ هذه الوظيفة بعد'
  });
};

// إنشاء وحدة تحكم مؤقتة إذا كانت الدوال غير موجودة
const tempController = {
  createOrder: notImplemented,
  getMyOrders: notImplemented,
  getOrderById: notImplemented,
  cancelOrder: notImplemented,
  rateOrder: notImplemented,
  getAllOrders: notImplemented,
  updateOrderStatus: notImplemented
};

// استيراد وحدة التحكم الفعلية إذا كانت موجودة
try {
  const actualController = require('../controllers/orderController');
  Object.assign(tempController, actualController);
} catch (error) {
  console.log('وحدة التحكم الخاصة بالطلبات غير مكتملة، سيتم استخدام دوال مؤقتة');
}

// التحقق من صحة البيانات
const orderValidation = [
  body('productId').notEmpty().withMessage('معرف المنتج مطلوب'),
  body('measurementId').notEmpty().withMessage('معرف المقاس مطلوب'),
  body('fabricChoice').notEmpty().withMessage('اختيار القماش مطلوب'),
  body('colorChoice').notEmpty().withMessage('اختيار اللون مطلوب'),
  body('quantity').isInt({ min: 1 }).withMessage('الكمية يجب أن تكون عدداً صحيحاً أكبر من الصفر')
];

// التحقق من صحة التقييم
const ratingValidation = [
  body('rate').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5'),
  body('comment').optional()
];

// التحقق من صحة تحديث الحالة
const statusUpdateValidation = [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('حالة الطلب غير صالحة')
];

// مسارات المستخدم العادي
const userRouter = express.Router();

// استخدام وسيط المصادقة
userRouter.use(authMiddleware);

// مسارات الطلبات للمستخدم
userRouter.post('/', orderValidation, validationMiddleware, tempController.createOrder);
userRouter.get('/', tempController.getMyOrders);
userRouter.get('/:id', tempController.getOrderById);
userRouter.put('/:id/cancel', tempController.cancelOrder);
userRouter.put('/:id/rate', ratingValidation, validationMiddleware, tempController.rateOrder);

// مسارات المسؤول
const adminRouter = express.Router();
adminRouter.use(authMiddleware, roleMiddleware('admin'));
adminRouter.get('/', tempController.getAllOrders);
adminRouter.get('/:id', tempController.getOrderById);
adminRouter.put('/:id/status', statusUpdateValidation, validationMiddleware, tempController.updateOrderStatus);

module.exports = { userRouter, adminRouter };
