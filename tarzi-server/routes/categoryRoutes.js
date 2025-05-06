const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// التحقق من صحة البيانات
const categoryValidation = [
  body('name').notEmpty().withMessage('اسم الفئة مطلوب').trim(),
  body('description').optional(),
  body('imageUrl').optional(),
  body('isActive').optional().isBoolean().withMessage('حالة النشاط يجب أن تكون قيمة منطقية'),
  body('featured').optional().isBoolean().withMessage('حالة التمييز يجب أن تكون قيمة منطقية'),
  body('order').optional().isNumeric().withMessage('الترتيب يجب أن يكون رقمًا')
];

// مسارات عامة
router.get('/', categoryController.getCategories);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/search', categoryController.searchCategories);
router.get('/:id', categoryController.getCategoryById);

// مسارات المسؤول
router.use(authMiddleware, roleMiddleware('admin'));
router.post('/', categoryValidation, validationMiddleware, categoryController.createCategory);
router.put('/:id', categoryValidation, validationMiddleware, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.patch('/:id/status', categoryController.toggleCategoryStatus);
router.get('/stats', categoryController.getCategoryStats);

module.exports = router;