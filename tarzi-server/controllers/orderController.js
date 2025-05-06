const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Measurement = require('../models/Measurement');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    إنشاء طلب جديد
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { productId, measurementId, fabricChoice, colorChoice, quantity, additionalRequests } = req.body;
  
  // التحقق من وجود المنتج
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(`المنتج غير موجود بالمعرف: ${productId}`, 404));
  }
  
  // التحقق من وجود المقاس وأنه ينتمي للمستخدم الحالي
  const measurement = await Measurement.findOne({
    _id: measurementId,
    userId: req.user.id
  });
  
  if (!measurement) {
    return next(new ErrorResponse('المقاس غير موجود أو غير مصرح به', 404));
  }
  
  // حساب السعر الإجمالي
  const totalPrice = product.price * quantity;
  
  // إنشاء الطلب
  const order = await Order.create({
    userId: req.user.id,
    productId,
    measurementId,
    fabricChoice,
    colorChoice,
    quantity,
    totalPrice,
    additionalRequests
  });
  
  // إرجاع الطلب مع البيانات المرتبطة
  const populatedOrder = await Order.findById(order._id)
    .populate('userId', 'username email phone')
    .populate('productId', 'name imageUrl price')
    .populate('measurementId', 'name');
  
  res.status(201).json({
    success: true,
    message: 'تم إنشاء الطلب بنجاح',
    data: populatedOrder
  });
});

// @desc    الحصول على طلبات المستخدم الحالي
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  
  const total = await Order.countDocuments({ userId: req.user.id });
  
  const orders = await Order.find({ userId: req.user.id })
    .populate('productId', 'name imageUrl price')
    .skip(skip)
    .limit(pageSize)
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    data: orders
  });
});

// @desc    الحصول على طلب محدد
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'username email phone')
    .populate('productId', 'name imageUrl price description')
    .populate('measurementId');
  
  if (!order) {
    return next(new ErrorResponse(`الطلب غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // التحقق من أن الطلب للمستخدم الحالي أو أن المستخدم مسؤول
  if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح لك بالوصول إلى هذا الطلب', 403));
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    إلغاء طلب
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`الطلب غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // التحقق من أن الطلب للمستخدم الحالي
  if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح لك بإلغاء هذا الطلب', 403));
  }
  
  // التحقق من إمكانية إلغاء الطلب
  if (order.status === 'cancelled') {
    return next(new ErrorResponse('هذا الطلب ملغى بالفعل', 400));
  }
  
  if (['delivered', 'shipped'].includes(order.status)) {
    return next(new ErrorResponse(`لا يمكن إلغاء الطلب في حالة ${order.status}`, 400));
  }
  
  // تحديث حالة الطلب
  order.status = 'cancelled';
  order.notes = req.body.reason || 'تم الإلغاء بواسطة المستخدم';
  await order.save();
  
  res.status(200).json({
    success: true,
    message: 'تم إلغاء الطلب بنجاح',
    data: order
  });
});

// @desc    تقييم طلب
// @route   PUT /api/orders/:id/rate
// @access  Private
exports.rateOrder = asyncHandler(async (req, res, next) => {
  const { rate, comment } = req.body;
  
  let order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`الطلب غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // التحقق من أن الطلب للمستخدم الحالي
  if (order.userId.toString() !== req.user.id) {
    return next(new ErrorResponse('غير مصرح لك بتقييم هذا الطلب', 403));
  }
  
  // التحقق من أن الطلب تم تسليمه
  if (order.status !== 'delivered') {
    return next(new ErrorResponse('يمكنك تقييم الطلبات المسلمة فقط', 400));
  }
  
  // تحديث التقييم
  order.rating = {
    rate,
    comment: comment || '',
    date: Date.now()
  };
  
  await order.save();
  
  // تحديث تقييم المنتج
  const product = await Product.findById(order.productId);
  
  if (product) {
    // حساب متوسط التقييمات
    const orders = await Order.find({
      productId: product._id,
      'rating.rate': { $exists: true }
    });
    
    const totalRatings = orders.length;
    const ratingSum = orders.reduce((sum, o) => sum + o.rating.rate, 0);
    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
    
    product.rating = parseFloat(averageRating.toFixed(1));
    product.numReviews = totalRatings;
    await product.save();
  }
  
  res.status(200).json({
    success: true,
    message: 'تم تقييم الطلب بنجاح',
    data: order
  });
});

// ========= وظائف المسؤول =========

// @desc    الحصول على جميع الطلبات (للمسؤول)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  // معلمات التصفية
  let query = {};
  
  // التصفية حسب الحالة
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // التصفية حسب رقم الطلب
  if (req.query.orderNumber) {
    query.orderNumber = { $regex: req.query.orderNumber, $options: 'i' };
  }
  
  // التصفية حسب المستخدم
  if (req.query.userId) {
    query.userId = req.query.userId;
  }
  
  // إعدادات الصفحات
  const pageSize = parseInt(req.query.pageSize) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  
  const total = await Order.countDocuments(query);
  
  const orders = await Order.find(query)
    .populate('userId', 'username email phone')
    .populate('productId', 'name imageUrl price')
    .skip(skip)
    .limit(pageSize)
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    data: orders
  });
});

// @desc    تحديث حالة الطلب (للمسؤول)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  
  let order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`الطلب غير موجود بالمعرف: ${req.params.id}`, 404));
  }
  
  // تحديث الطلب
  order.status = status;
  if (notes) {
    order.notes = notes;
  }
  
  await order.save();
  
  // تحديث أن الطلب تم تعديله بواسطة المسؤول
  order.updatedBy = {
    userId: req.user.id,
    date: Date.now()
  };
  
  await order.save();
  
  // إرجاع الطلب مع البيانات المرتبطة
  const updatedOrder = await Order.findById(req.params.id)
    .populate('userId', 'username email phone')
    .populate('productId', 'name imageUrl price')
    .populate('measurementId', 'name');
  
  res.status(200).json({
    success: true,
    message: `تم تحديث حالة الطلب إلى "${status}" بنجاح`,
    data: updatedOrder
  });
});
