const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع المنتجات
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // الاستعلام
  let query = {};

  // البحث
  if (req.query.keyword) {
    query.name = { $regex: req.query.keyword, $options: 'i' };
  }

  // التصفية حسب الفئة
  if (req.query.category) {
    query.category = req.query.category;
  }

  // التصفية حسب النشاط
  if (req.query.active) {
    query.isActive = req.query.active === 'true';
  }

  // عدد العناصر لكل صفحة
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  // تنفيذ الاستعلام
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  // إرسال الاستجابة
  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    products
  });
});

// @desc    الحصول على منتج محدد
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (!product) {
    return next(new ErrorResponse(`المنتج غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    الحصول على المنتجات المميزة
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({ isFeatured: true, isActive: true })
    .limit(limit)
    .populate('category', 'name');

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// @desc    إنشاء منتج جديد
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  // إضافة معرف المنشئ
  req.body.createdBy = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// @desc    تحديث منتج
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`المنتج غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`المنتج غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف المنتج بنجاح'
  });
});

// @desc    تغيير حالة تمييز المنتج
// @route   PATCH /api/products/:id/featured
// @access  Private/Admin
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  const { isFeatured } = req.body;
  
  if (typeof isFeatured !== 'boolean') {
    return next(new ErrorResponse('يجب توفير حالة التمييز (isFeatured) كقيمة منطقية', 400));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isFeatured },
    { new: true }
  );

  if (!product) {
    return next(new ErrorResponse(`المنتج غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});