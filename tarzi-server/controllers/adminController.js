const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على إحصائيات لوحة التحكم
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // إحصائيات المستخدمين
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  
  // إحصائيات المنتجات
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  
  // إحصائيات الطلبات
  const totalOrders = await Order.countDocuments();
  const newOrders = await Order.countDocuments({ status: 'pending' });
  const inProgressOrders = await Order.countDocuments({ status: 'processing' });
  const completedOrders = await Order.countDocuments({ status: 'delivered' });
  
  // إحصائيات المبيعات
  const salesData = await Order.aggregate([
    {
      $match: {
        status: { $nin: ['cancelled'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
  
  const sales = {
    totalRevenue: salesData.length > 0 ? salesData[0].totalRevenue : 0,
    averageOrderValue: salesData.length > 0 ? Number(salesData[0].averageOrderValue.toFixed(2)) : 0
  };
  
  // الطلبات الأخيرة
  const latestOrders = await Order.find()
    .populate('userId', 'username')
    .populate('productId', 'name price')
    .sort({ createdAt: -1 })
    .limit(5);
  
  // سجل الأنشطة الأخيرة
  const latestActivities = await ActivityLog.find()
    .populate('userId', 'username')
    .sort({ timestamp: -1 })
    .limit(10);
  
  res.status(200).json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      products: {
        total: totalProducts,
        active: activeProducts
      },
      orders: {
        total: totalOrders,
        new: newOrders,
        inProgress: inProgressOrders,
        completed: completedOrders
      },
      sales,
      latestOrders,
      latestActivities
    }
  });
});

// @desc    الحصول على جميع المستخدمين
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // الاستعلام
  let query = {};
  
  // البحث
  if (req.query.keyword) {
    const keyword = req.query.keyword;
    query.$or = [
      { username: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } }
    ];
  }
  
  // التصفية حسب الدور
  if (req.query.role) {
    query.role = req.query.role;
  }
  
  // التصفية حسب الحالة
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }
  
  // عدد العناصر لكل صفحة
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  
  // عدد المستخدمين الإجمالي
  const total = await User.countDocuments(query);
  
  // الحصول على المستخدمين
  const users = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    users
  });
});

// @desc    الحصول على مستخدم محدد
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse(`المستخدم غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    user
  });
});

// @desc    تغيير حالة المستخدم (نشط/غير نشط)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;
  
  if (typeof isActive !== 'boolean') {
    return next(new ErrorResponse('يجب توفير حالة النشاط (isActive) كقيمة منطقية', 400));
  }
  
  // منع المسؤول من تغيير حالته الخاصة
  if (req.params.id === req.user.id) {
    return next(new ErrorResponse('لا يمكنك تغيير حالة حسابك الخاص', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  ).select('-password');
  
  if (!user) {
    return next(new ErrorResponse(`المستخدم غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // تسجيل النشاط
  await ActivityLog.create({
    userId: req.user.id,
    action: isActive ? 'تفعيل حساب' : 'تعطيل حساب',
    entity: 'user',
    entityId: user._id,
    details: {
      username: user.username,
      email: user.email,
      isActive
    }
  });
  
  res.status(200).json({
    success: true,
    message: isActive ? 'تم تفعيل حساب المستخدم بنجاح' : 'تم تعطيل حساب المستخدم بنجاح',
    user
  });
});

// @desc    تغيير دور المستخدم
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  
  if (!role || !['user', 'admin', 'professional'].includes(role)) {
    return next(new ErrorResponse('يرجى توفير دور صالح (user, admin, professional)', 400));
  }
  
  // منع المسؤول من تغيير دوره الخاص
  if (req.params.id === req.user.id) {
    return next(new ErrorResponse('لا يمكنك تغيير دور حسابك الخاص', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');
  
  if (!user) {
    return next(new ErrorResponse(`المستخدم غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // تسجيل النشاط
  await ActivityLog.create({
    userId: req.user.id,
    action: 'تغيير دور مستخدم',
    entity: 'user',
    entityId: user._id,
    details: {
      username: user.username,
      email: user.email,
      newRole: role
    }
  });
  
  res.status(200).json({
    success: true,
    message: `تم تغيير دور المستخدم إلى ${role} بنجاح`,
    user
  });
});

// @desc    الحصول على تقرير المبيعات
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
exports.getSalesReport = asyncHandler(async (req, res, next) => {
  // معلمات التصفية
  const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0);
  const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
  
  // ضبط نهاية اليوم للتاريخ النهائي
  endDate.setHours(23, 59, 59, 999);
  
  // التصفية حسب الحالة
  const statusFilter = req.query.status ? { status: req.query.status } : {};
  
  // الاستعلام
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    },
    ...statusFilter
  };
  
  // الحصول على ملخص المبيعات
  const salesSummary = await Order.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
  
  // الحصول على المبيعات حسب الحالة
  const salesByStatus = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  // الحصول على المبيعات حسب التاريخ
  const salesByDate = await Order.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  // الحصول على المنتجات الأكثر مبيعًا
  const topProducts = await Order.aggregate([
    { $match: query },
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$productId',
        productName: { $first: '$product.name' },
        count: { $sum: '$quantity' },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  res.status(200).json({
    success: true,
    reportData: {
      summary: salesSummary.length > 0 ? {
        totalRevenue: salesSummary[0].totalRevenue,
        totalOrders: salesSummary[0].totalOrders,
        averageOrderValue: Number(salesSummary[0].averageOrderValue.toFixed(2))
      } : {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
      },
      byStatus: salesByStatus,
      byDate: salesByDate,
      topProducts
    },
    dateRange: {
      startDate,
      endDate
    }
  });
});

// @desc    تنزيل تقرير
// @route   GET /api/admin/reports/:reportType/download
// @access  Private/Admin
exports.downloadReport = asyncHandler(async (req, res, next) => {
  // نوع التقرير
  const { reportType } = req.params;
  
  // تنسيق التقرير
  const format = req.query.format || 'csv';
  
  // التحقق من نوع التقرير
  if (!['sales', 'users', 'products', 'orders'].includes(reportType)) {
    return next(new ErrorResponse('نوع التقرير غير معتمد', 400));
  }
  
  // التحقق من تنسيق التقرير
  if (!['csv', 'xlsx'].includes(format)) {
    return next(new ErrorResponse('تنسيق التقرير غير معتمد', 400));
  }
  
  // معلمات التصفية
  const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0);
  const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
  
  // ضبط نهاية اليوم للتاريخ النهائي
  endDate.setHours(23, 59, 59, 999);
  
  // الاستعلام
  const dateQuery = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  let data = [];
  let fileName = '';
  
  // استخراج البيانات حسب نوع التقرير
  switch (reportType) {
    case 'sales':
      data = await Order.find(dateQuery)
        .populate('userId', 'username email')
        .populate('productId', 'name price')
        .lean();
      fileName = `sales_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
      break;
      
    case 'users':
      data = await User.find(dateQuery).select('-password').lean();
      fileName = `users_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
      break;
      
    case 'products':
      data = await Product.find(dateQuery).populate('category', 'name').lean();
      fileName = `products_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
      break;
      
    case 'orders':
      data = await Order.find(dateQuery).lean();
      fileName = `orders_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
      break;
  }
  
  // تحويل البيانات إلى التنسيق المطلوب وإرسالها
  // هذا جزء بسيط وسيتطلب مكتبة خارجية مثل json2csv أو exceljs
  
  // مثال بسيط (بدون المكتبات الخارجية)
  const jsonData = JSON.stringify(data);
  
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(jsonData);
  
  // ملاحظة: في التنفيذ الفعلي، يجب استخدام مكتبات مناسبة لتنسيق البيانات
});

// @desc    الحصول على سجل الأنشطة
// @route   GET /api/admin/activity-log
// @access  Private/Admin
exports.getActivityLog = asyncHandler(async (req, res, next) => {
  // معلمات الاستعلام
  const pageSize = parseInt(req.query.pageSize) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  
  // الاستعلام
  let query = {};
  
  // التصفية حسب المستخدم
  if (req.query.userId) {
    query.userId = req.query.userId;
  }
  
  // التصفية حسب الإجراء
  if (req.query.action) {
    query.action = { $regex: req.query.action, $options: 'i' };
  }
  
  // التصفية حسب الكيان
  if (req.query.entity) {
    query.entity = req.query.entity;
  }
  
  // التصفية حسب التاريخ
  if (req.query.startDate || req.query.endDate) {
    query.timestamp = {};
    
    if (req.query.startDate) {
      query.timestamp.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      query.timestamp.$lte = endDate;
    }
  }
  
  // عدد السجلات الإجمالي
  const total = await ActivityLog.countDocuments(query);
  
  // الحصول على السجلات
  const logs = await ActivityLog.find(query)
    .populate('userId', 'username email')
    .skip(skip)
    .limit(pageSize)
    .sort({ timestamp: -1 });
  
  res.status(200).json({
    success: true,
    count: logs.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    logs
  });
});

// @desc    إدارة إعدادات النظام
// @route   GET/PUT /api/admin/settings
// @access  Private/Admin
exports.manageSystemSettings = asyncHandler(async (req, res, next) => {
  // تطبيق هذه الوظيفة يعتمد على نموذج الإعدادات المستخدم في النظام
  // يمكن تنفيذه بطرق مختلفة (ملف تكوين، قاعدة بيانات، إلخ)
  
  // للتنفيذ البسيط، يمكن استخدام نموذج للإعدادات في قاعدة البيانات
  // ويمكن تحديث هذه الدالة لاحقًا بناءً على متطلبات المشروع
  
  res.status(200).json({
    success: true,
    message: 'تمت معالجة إعدادات النظام بنجاح',
  });
});