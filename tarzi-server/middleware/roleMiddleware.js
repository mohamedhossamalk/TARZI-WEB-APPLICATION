const ErrorResponse = require('../utils/errorResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('غير مصرح به، يجب تسجيل الدخول أولاً', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `المستخدم ذو الدور "${req.user.role}" غير مصرح له بالوصول إلى هذا المسار`,
          403
        )
      );
    }
    next();
  };
};

module.exports = authorize;
