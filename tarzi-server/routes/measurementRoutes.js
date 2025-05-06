const express = require('express');
const { body } = require('express-validator');
const measurementController = require('../controllers/measurementController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// التحقق من صحة البيانات
const measurementValidation = [
  body('name').notEmpty().withMessage('اسم المقاس مطلوب'),
  body('chest').isNumeric().withMessage('قياس الصدر يجب أن يكون رقمًا'),
  body('waist').isNumeric().withMessage('قياس الخصر يجب أن يكون رقمًا'),
  body('hips').isNumeric().withMessage('قياس الورك يجب أن يكون رقمًا'),
  body('shoulderWidth').isNumeric().withMessage('عرض الكتف يجب أن يكون رقمًا'),
  body('sleeveLength').isNumeric().withMessage('طول الكم يجب أن يكون رقمًا'),
  body('inseam').isNumeric().withMessage('قياس الداخلي للساق يجب أن يكون رقمًا'),
  body('height').isNumeric().withMessage('الطول يجب أن يكون رقمًا'),
  body('weight').isNumeric().withMessage('الوزن يجب أن يكون رقمًا')
];

// استخدام وسيط المصادقة لجميع مسارات المقاسات
router.use(authMiddleware);

// مسارات المقاسات
router.get('/', measurementController.getAllMeasurements);
router.get('/:id', measurementController.getMeasurementById);
router.post('/', measurementValidation, validationMiddleware, measurementController.createMeasurement);
router.put('/:id', measurementValidation, validationMiddleware, measurementController.updateMeasurement);
router.delete('/:id', measurementController.deleteMeasurement);
router.put('/:id/default', measurementController.setDefaultMeasurement);

module.exports = router;