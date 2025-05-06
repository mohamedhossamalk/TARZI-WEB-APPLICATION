const jwt = require('jsonwebtoken');

// إنشاء رمز التوثيق
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// التحقق من رمز التوثيق
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
};

// فك تشفير رمز التوثيق بدون التحقق من التوقيع
exports.decodeToken = (token) => {
  return jwt.decode(token);
};