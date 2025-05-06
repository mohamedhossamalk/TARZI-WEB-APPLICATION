const winston = require('winston');
const path = require('path');

/**
 * إنشاء مسجل Winston مكون
 * @returns {winston.Logger} مثيل المسجل
 */
const createLogger = () => {
  // تنسيق المسجل
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'tarzi-api' },
    transports: [
      // تسجيل جميع المستويات في ملف
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      // إضافة وحدة نقل وحدة التحكم في وضع التطوير
      ...(process.env.NODE_ENV === 'development' ?
        [new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })] : [])
    ]
  });
};

/**
 * وسيط لتسجيل الطلبات HTTP
 * @param {winston.Logger} logger مثيل المسجل
 * @returns {Function} وسيط Express
 */
const logRequestMiddleware = (logger) => {
  return (req, res, next) => {
    // تسجيل بداية الطلب
    const start = Date.now();

    // تسجيل نهاية الطلب
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
      
      logger[logLevel]({
        message: `${req.method} ${req.originalUrl}`,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        responseTime,
        userAgent: req.get('user-agent') || ''
      });
    });

    next();
  };
};

module.exports = {
  createLogger,
  logRequestMiddleware
};