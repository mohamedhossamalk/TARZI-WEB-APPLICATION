const ErrorResponse = require('../utils/errorResponse');

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  console.log(`${err}`);
  
  // خطأ Mongoose CastError - معرف غير صالح
  if (err.name === 'CastError') {
    const message = `المورد غير موجود بالمعرف: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  
  // خطأ Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `القيمة '${value}' مستخدمة بالفعل في الحقل '${field}'. الرجاء استخدام قيمة أخرى.`;
    error = new ErrorResponse(message, 400);
  }
  
  // خطأ Mongoose validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;
