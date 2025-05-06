const express = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// التحقق من صحة البيانات
const serviceValidation = [
  body('title').notEmpty().withMessage('عنوان الخدمة مطلوب'),
  body('description').notEmpty().withMessage('وصف الخدمة مطلوب'),
  body('price').isNumeric().withMessage('السعر يجب أن يكون رقمًا')
    .custom(value => {
      if (value < 0) {
        throw new Error('السعر يجب أن يكون أكبر من أو يساوي صفر');
      }
      return true;
    }),
  body('category').notEmpty().withMessage('فئة الخدمة مطلوبة'),
  body('imageUrl').notEmpty().withMessage('صورة الخدمة مطلوبة')
];

const requestValidation = [
  body('details').notEmpty().withMessage('تفاصيل الطلب مطلوبة'),
  body('preferredDate').optional().isDate().withMessage('التاريخ المفضل يجب أن يكون بتنسيق صالح'),
  body('budget').optional().isNumeric().withMessage('الميزانية يجب أن تكون رقمًا')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5'),
  body('comment').optional()
];

// المسارات العامة
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// مسارات المستخدم المصادق عليه
router.use(authMiddleware);
router.get('/myservices', serviceController.getMyServices);
router.post('/', serviceValidation, validationMiddleware, serviceController.createService);
router.put('/:id', serviceValidation, validationMiddleware, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

// مسارات طلب الخدمة
router.post('/:id/request', requestValidation, validationMiddleware, serviceController.requestService);
router.post('/:id/review', reviewValidation, validationMiddleware, serviceController.reviewService);

// مسارات المهنيين
const professionalRouter = express.Router();
professionalRouter.use(authMiddleware, roleMiddleware('professional'));

// مسارات المسؤول
const adminRouter = express.Router();
adminRouter.use(authMiddleware, roleMiddleware('admin'));
// إضافة مسارات المسؤول هنا إذا لزم الأمر

module.exports = router;
