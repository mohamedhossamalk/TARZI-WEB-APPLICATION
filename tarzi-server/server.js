const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const corsOptions = require('./config/corsOptions');
const { createLogger, logRequestMiddleware } = require('./utils/logger');

console.log('========================================');
console.log('       بدء تشغيل خادم منصة ترزي         ');
console.log('========================================');

// تهيئة السجل
const logger = createLogger();
console.log('✅ تم تهيئة نظام التسجيل');

// تحميل متغيرات البيئة
dotenv.config();
console.log(`✅ تم تحميل متغيرات البيئة: ${process.env.NODE_ENV}`);

// الاتصال بقاعدة البيانات
console.log('🔄 جاري الاتصال بقاعدة البيانات...');
connectDB().then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
}).catch(err => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
});

const app = express();
console.log('✅ تم إنشاء تطبيق Express');

// ======= الوسائط البرمجية الأساسية =======
console.log('🔄 جاري إعداد الوسائط البرمجية...');

// التعامل مع البيانات
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
console.log('✅ تم إعداد معالجات البيانات والـ cookies');

// الأمان
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
console.log('✅ تم إعداد وسائط الأمان (CORS, Helmet, XSS, HPP)');

// الضغط لتحسين الأداء
app.use(compression());
console.log('✅ تم تفعيل ضغط الاستجابات');

// تسجيل الطلبات
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('✅ تم تفعيل تسجيل الطلبات بوضع التطوير (Morgan)');
} else {
  app.use(logRequestMiddleware(logger));
  console.log('✅ تم تفعيل تسجيل الطلبات بوضع الإنتاج (Logger)');
}

// ======= محددات معدل الطلبات =======
console.log('🔄 جاري إعداد محددات معدل الطلبات...');

// محدد عام (100 طلب لكل 10 دقائق)
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'تم تجاوز الحد المسموح به من الطلبات. يرجى المحاولة مرة أخرى لاحقًا.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);
console.log('✅ تم إعداد المحدد العام: 100 طلب/10 دقائق');

// محدد خاص للمصادقة (10 طلبات لكل 15 دقيقة)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'تم تجاوز الحد المسموح به من طلبات المصادقة. يرجى المحاولة مرة أخرى لاحقًا.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgotpassword', authLimiter);
console.log('✅ تم إعداد محدد المصادقة: 10 طلبات/15 دقيقة');

// ======= المجلد العام =======
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
console.log('✅ تم إعداد المجلد العام للتحميلات:', path.join(__dirname, 'public/uploads'));

// ======= اختبار API =======
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'واجهة برمجة تطبيقات منصة ترزي تعمل بنجاح',
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || '1.0.0',
    timestamp: new Date().toISOString()
  });
});
console.log('✅ تم إعداد مسار الاختبار الرئيسي');

// ======= مسارات API =======
console.log('🔄 جاري استيراد وتسجيل مسارات API...');

// استيراد المسارات
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
console.log('✅ تم استيراد جميع وحدات المسارات');

// تسجيل المسارات
app.use('/api/auth', authRoutes);
console.log('✅ تم تسجيل مسارات المصادقة: /api/auth');

app.use('/api/users', userRoutes);
console.log('✅ تم تسجيل مسارات المستخدمين: /api/users');

app.use('/api/products', productRoutes);
console.log('✅ تم تسجيل مسارات المنتجات: /api/products');

app.use('/api/orders', orderRoutes.userRouter || orderRoutes);
console.log('✅ تم تسجيل مسارات الطلبات للمستخدمين: /api/orders');

app.use('/api/measurements', measurementRoutes);
console.log('✅ تم تسجيل مسارات المقاسات: /api/measurements');

app.use('/api/uploads', uploadRoutes);
console.log('✅ تم تسجيل مسارات التحميل: /api/uploads');

app.use('/api/professionalservices', serviceRoutes);
console.log('✅ تم تسجيل مسارات الخدمات المهنية: /api/professionalservices');

app.use('/api/notifications', notificationRoutes);
console.log('✅ تم تسجيل مسارات الإشعارات: /api/notifications');

app.use('/api/categories', categoryRoutes);
console.log('✅ تم تسجيل مسارات الفئات: /api/categories');

app.use('/api/admin', adminRoutes);
console.log('✅ تم تسجيل مسارات المسؤول: /api/admin');

// استخدام مسارات المسؤول إذا كانت موجودة
if (orderRoutes.adminRouter) {
  app.use('/api/admin/orders', orderRoutes.adminRouter);
  console.log('✅ تم تسجيل مسارات طلبات المسؤول: /api/admin/orders');
} else {
  console.log('⚠️ لم يتم العثور على مسارات طلبات المسؤول');
}

// ======= التعامل مع المسارات غير الموجودة =======
app.use('*', (req, res, next) => {
  const error = new Error(`المسار غير موجود - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
console.log('✅ تم إعداد معالج المسارات غير الموجودة');

// ======= معالجة الأخطاء العامة =======
app.use(errorMiddleware);
console.log('✅ تم إعداد وسيط معالجة الأخطاء العامة');

// ======= تشغيل الخادم =======
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🚀 الخادم يعمل في البيئة ${process.env.NODE_ENV} على المنفذ ${PORT}`);
  console.log('========================================');
  console.log('📋 المسارات المتاحة:');
  console.log('   - GET  /                          (الصفحة الرئيسية للـ API)');
  console.log('   - POST /api/auth/register         (تسجيل مستخدم جديد)');
  console.log('   - POST /api/auth/login            (تسجيل الدخول)');
  console.log('   - GET  /api/products              (عرض المنتجات)');
  console.log('   - GET  /api/products/:id          (عرض منتج محدد)');
  console.log('   - POST /api/orders                (إنشاء طلب جديد - يتطلب مصادقة)');
  console.log('   - GET  /api/users/profile         (عرض الملف الشخصي - يتطلب مصادقة)');
  console.log('   - GET  /api/admin                 (لوحة تحكم المسؤول - يتطلب صلاحيات المسؤول)');
  console.log('========================================');
  console.log('📊 معلومات النظام:');
  console.log(`   - النواة: ${process.version}`);
  console.log(`   - المنصة: ${process.platform}`);
  console.log(`   - معرف العملية: ${process.pid}`);
  console.log(`   - الذاكرة المستخدمة: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log('========================================\n');
  
  logger.info(`الخادم يعمل في البيئة ${process.env.NODE_ENV} على المنفذ ${PORT}`);
});

// ======= معالجة الاستثناءات غير المتوقعة =======
console.log('✅ تم إعداد معالجات الاستثناءات');

// معالجة استثناءات عدم التقاط الوعود
process.on('unhandledRejection', (err, promise) => {
  console.log('\n❌ استثناء غير معالج: وعد غير متابع');
  console.log(`   السبب: ${err.message}`);
  console.log('   جاري إغلاق الخادم...');
  
  logger.error(`خطأ: ${err.message}`, { stack: err.stack });
  
  // إغلاق الخادم بشكل مناسب
  server.close(() => process.exit(1));
});

// معالجة الاستثناءات غير المعالجة
process.on('uncaughtException', (err) => {
  console.log('\n❌ استثناء غير معالج');
  console.log(`   السبب: ${err.message}`);
  console.log('   جاري إغلاق الخادم...');
  
  logger.error(`خطأ غير معالج: ${err.message}`, { stack: err.stack });
  
  // إغلاق الخادم بشكل مناسب
  server.close(() => process.exit(1));
});

// معالجة إشارات التوقف
process.on('SIGTERM', () => {
  console.log('\n⚠️ تم استلام إشارة SIGTERM');
  console.log('   جاري إغلاق الخادم بشكل مناسب...');
  
  logger.info('تم استلام إشارة SIGTERM. إغلاق الخادم بشكل مناسب...');
  
  server.close(() => {
    logger.info('تم إغلاق الخادم بنجاح.');
    console.log('✅ تم إغلاق الخادم بنجاح');
    process.exit(0);
  });
});

module.exports = server; // للاختبارات