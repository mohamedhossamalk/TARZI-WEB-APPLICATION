const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// حماية المسارات
module.exports = asyncHandler(async (req, res, next) => {
  let token;

  // التحقق من وجود رمز التوثيق في الرأس
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // التحقق من وجود الرمز
  if (!token) {
    return next(new ErrorResponse('غير مصرح لك بالوصول إلى هذا المسار', 401));
  }

  try {
    // التحقق من الرمز
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // الحصول على المستخدم من الرمز
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('لم يتم العثور على المستخدم', 401));
    }

    // التحقق من نشاط الحساب
    if (!user.isActive) {
      return next(new ErrorResponse('هذا الحساب غير نشط. يرجى الاتصال بالدعم', 401));
    }

    // إضافة المستخدم إلى الطلب
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('غير مصرح لك بالوصول إلى هذا المسار', 401));
  }
});