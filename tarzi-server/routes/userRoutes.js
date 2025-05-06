const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// مساعد مؤقت لدوال التحكم غير المنفذة بعد
const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'لم يتم تنفيذ هذه الوظيفة بعد'
  });
};

// إنشاء وحدة تحكم مؤقتة إذا كان الملف الأصلي غير مكتمل
const userController = {
  getProfile: notImplemented,
  updateProfile: notImplemented,
  updatePassword: notImplemented,
  getAddresses: notImplemented,
  addAddress: notImplemented,
  updateAddress: notImplemented,
  deleteAddress: notImplemented,
  getAllUsers: notImplemented,
  getUserById: notImplemented,
  updateUser: notImplemented,
  deleteUser: notImplemented,
  toggleUserStatus: notImplemented,
  changeUserRole: notImplemented
};

// استيراد وحدة التحكم الفعلية إذا كانت موجودة
try {
  const actualController = require('../controllers/userController');
  // دمج الوحدة الفعلية مع الوحدة المؤقتة (استخدام الدوال المنفذة فعلاً)
  Object.assign(userController, actualController);
} catch (error) {
  console.log('وحدة التحكم الخاصة بالمستخدمين غير مكتملة، سيتم استخدام دوال مؤقتة');
}

// التحقق من صحة البيانات
const profileValidation = [
  body('username').optional().notEmpty().withMessage('اسم المستخدم لا يمكن أن يكون فارغًا'),
  body('phone').optional(),
  body('address').optional().isObject().withMessage('العنوان يجب أن يكون كائنًا')
];

const addressValidation = [
  body('street').notEmpty().withMessage('الشارع مطلوب'),
  body('city').notEmpty().withMessage('المدينة مطلوبة'),
  body('postalCode').optional()
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword').isLength({ min: 6 }).withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
];

// مسارات المستخدم العادي - تتطلب مصادقة
router.use(authMiddleware);

// مسارات الملف الشخصي
router.get('/profile', userController.getProfile);
router.put('/profile', profileValidation, validationMiddleware, userController.updateProfile);

// مسارات تغيير كلمة المرور
router.put('/password', passwordValidation, validationMiddleware, userController.updatePassword);

// مسارات العناوين
router.get('/addresses', userController.getAddresses);
router.post('/addresses', addressValidation, validationMiddleware, userController.addAddress);
router.put('/addresses/:id', addressValidation, validationMiddleware, userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// مسارات إضافية تتطلب دور المسؤول
const adminRouter = express.Router();
adminRouter.use(roleMiddleware('admin'));

// إدارة المستخدمين
adminRouter.get('/', userController.getAllUsers);
adminRouter.get('/:id', userController.getUserById);
adminRouter.put('/:id', userController.updateUser);
adminRouter.delete('/:id', userController.deleteUser);
adminRouter.patch('/:id/status', userController.toggleUserStatus);
adminRouter.patch('/:id/role', userController.changeUserRole);

// إضافة مسارات المسؤول إلى الموجّه الرئيسي
router.use(adminRouter);

module.exports = router;