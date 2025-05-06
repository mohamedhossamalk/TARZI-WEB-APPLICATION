const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// تكوين التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.FILE_UPLOAD_PATH || './public/uploads');
  },
  filename: function (req, file, cb) {
    // إنشاء اسم فريد للملف بإضافة طابع زمني
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// التحقق من نوع الملف
const fileFilter = (req, file, cb) => {
  // أنواع الملفات المسموح بها للصور
  const imageFileTypes = /jpeg|jpg|png|gif|webp/;
  // أنواع الملفات المسموح بها للمستندات
  const docFileTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  
  // تحقق من نوع الملف حسب المسار
  if (req.originalUrl.includes('/uploads/image')) {
    // للصور
    const isValidImageType = imageFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (isValidImageType) {
      return cb(null, true);
    } else {
      cb(
        new ErrorResponse(
          'نوع الملف غير مدعوم. يرجى تحميل صورة (jpeg, jpg, png, gif, webp)',
          400
        )
      );
    }
  } else if (req.originalUrl.includes('/uploads/document')) {
    // للمستندات
    const isValidDocType = docFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (isValidDocType) {
      return cb(null, true);
    } else {
      cb(
        new ErrorResponse(
          'نوع الملف غير مدعوم. يرجى تحميل مستند (pdf, doc, docx, xls, xlsx, ppt, pptx)',
          400
        )
      );
    }
  } else {
    // المسار غير معروف
    cb(new ErrorResponse('المسار غير صالح للتحميل', 400));
  }
};

// إنشاء وسيط التحميل
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB افتراضيًا
  },
  fileFilter
});

module.exports = {
  uploadSingleImage: upload.single('image'),
  uploadMultipleImages: upload.array('images', 10), // 10 صور كحد أقصى
  uploadDocument: upload.single('document')
};