const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// التحقق من صحة البيانات
const registerValidation = [
  body('username').notEmpty().withMessage('اسم المستخدم مطلوب'),
  body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('phone').optional()
];

const loginValidation = [
  body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
];

// مسارات المصادقة
router.post('/register', registerValidation, validationMiddleware, authController.register);
router.post('/login', loginValidation, validationMiddleware, authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/updateprofile', authMiddleware, authController.updateProfile);
router.put('/changepassword', authMiddleware, authController.changePassword);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword', authController.resetPassword);

module.exports = router;