const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// التحقق من صحة البيانات
const productValidation = [
  body('name').notEmpty().withMessage('اسم المنتج مطلوب'),
  body('description').notEmpty().withMessage('وصف المنتج مطلوب'),
  body('price').isNumeric().withMessage('السعر يجب أن يكون رقمًا').custom(value => {
    if (value < 0) {
      throw new Error('السعر يجب أن يكون أكبر من أو يساوي صفر');
    }
    return true;
  }),
  body('category').notEmpty().withMessage('فئة المنتج مطلوبة'),
  body('imageUrl').notEmpty().withMessage('صورة المنتج مطلوبة'),
  body('fabricOptions').isArray().withMessage('خيارات القماش يجب أن تكون مصفوفة'),
  body('colorOptions').isArray().withMessage('خيارات اللون يجب أن تكون مصفوفة')
];

// مسارات عامة
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// مسارات المسؤول
router.use(authMiddleware, roleMiddleware('admin'));
router.post('/', productValidation, validationMiddleware, productController.createProduct);
router.put('/:id', productValidation, validationMiddleware, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/featured', productController.toggleFeatured);

module.exports = router;