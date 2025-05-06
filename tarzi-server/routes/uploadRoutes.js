const express = require('express');
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// مسارات عامة
router.get('/supported-types', uploadController.getSupportedFileTypes);

// مسارات خاصة تتطلب مصادقة
router.use(authMiddleware);
router.post('/image', uploadMiddleware.uploadSingleImage, uploadController.uploadImage);
router.post('/images', uploadMiddleware.uploadMultipleImages, uploadController.uploadMultipleImages);
router.post('/document', uploadMiddleware.uploadDocument, uploadController.uploadDocument);
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;