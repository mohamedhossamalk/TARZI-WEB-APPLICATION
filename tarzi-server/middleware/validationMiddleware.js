const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

/**
 * وسيط للتحقق من صحة الطلبات
 */
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // جمع رسائل الخطأ
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new ErrorResponse(errorMessages, 400));
  }
  
  next();
};

module.exports = validationMiddleware;
