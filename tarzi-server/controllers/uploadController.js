const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    تحميل صورة واحدة
// @route   POST /api/uploads/image
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  // التحقق من وجود الملف
  if (!req.file) {
    return next(new ErrorResponse('يرجى تحميل صورة', 400));
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const imagePath = `/uploads/${req.file.filename}`;
  const fullUrl = `${baseUrl}${imagePath}`;

  res.status(200).json({
    success: true,
    imageUrl: imagePath,
    fullUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// @desc    تحميل عدة صور
// @route   POST /api/uploads/images
// @access  Private
exports.uploadMultipleImages = asyncHandler(async (req, res, next) => {
  // التحقق من وجود الملفات
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('يرجى تحميل صورة واحدة على الأقل', 400));
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const images = req.files.map(file => {
    const imagePath = `/uploads/${file.filename}`;
    return {
      imageUrl: imagePath,
      fullUrl: `${baseUrl}${imagePath}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size
    };
  });

  res.status(200).json({
    success: true,
    count: images.length,
    images
  });
});

// @desc    تحميل مستند
// @route   POST /api/uploads/document
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  // التحقق من وجود الملف
  if (!req.file) {
    return next(new ErrorResponse('يرجى تحميل مستند', 400));
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const docPath = `/uploads/${req.file.filename}`;
  const fullUrl = `${baseUrl}${docPath}`;

  res.status(200).json({
    success: true,
    documentUrl: docPath,
    fullUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// @desc    حذف صورة
// @route   DELETE /api/uploads/:filename
// @access  Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const filename = req.params.filename;
  const uploadPath = path.join(process.env.FILE_UPLOAD_PATH || './public/uploads', filename);

  // التحقق من وجود الملف
  if (!fs.existsSync(uploadPath)) {
    return next(new ErrorResponse(`الملف ${filename} غير موجود`, 404));
  }

  // حذف الملف
  fs.unlinkSync(uploadPath);

  res.status(200).json({
    success: true,
    message: `تم حذف الملف ${filename} بنجاح`
  });
});

// @desc    الحصول على أنواع الملفات المدعومة
// @route   GET /api/uploads/supported-types
// @access  Public
exports.getSupportedFileTypes = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    supportedTypes: {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    },
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB افتراضيًا
  });
});