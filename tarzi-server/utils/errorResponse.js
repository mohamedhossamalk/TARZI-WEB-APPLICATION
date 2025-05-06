class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // تحديد موقع الخطأ في كومة الاستدعاء
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
