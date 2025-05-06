
// وسيط لالتقاط الأخطاء في الدوال غير المتزامنة
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;