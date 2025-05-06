const whitelist = [
  'http://localhost:3000', // واجهة المستخدم للتطوير
  'https://tarzi.com', // عنوان الإنتاج
  // يمكن إضافة المزيد من النطاقات المسموح بها
];

const corsOptions = {
  origin: function (origin, callback) {
    // السماح بالطلبات التي ليس لها أصل (مثل تطبيقات الجوال وعملاء API)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('غير مسموح به بواسطة سياسة CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;