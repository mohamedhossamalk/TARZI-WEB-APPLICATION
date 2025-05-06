const Category = require('../models/Category');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع الفئات
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  // معلمات الاستعلام
  const showInactive = req.query.showInactive === 'true';
  
  // الاستعلام
  let query = {};
  
  // عرض الفئات النشطة فقط للمستخدمين العاديين
  if (!showInactive && (!req.user || req.user.role !== 'admin')) {
    query.isActive = true;
  }
  
  // تنفيذ الاستعلام
  let categories = await Category.find(query).sort({ order: 1, name: 1 });
  
  // إذا كان المستخدم مسؤولاً، أضف عدد المنتجات لكل فئة
  if (req.user && req.user.role === 'admin') {
    // استخدام الحقل الافتراضي
    categories = await Category.find(query).populate('productCount').sort({ order: 1, name: 1 });
  }

  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    الحصول على فئة محددة
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`الفئة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }
  
  // التحقق مما إذا كان يمكن عرض الفئة غير النشطة للمستخدمين العاديين
  if (!category.isActive && (!req.user || req.user.role !== 'admin')) {
    return next(new ErrorResponse(`الفئة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    category
  });
});

// @desc    إنشاء فئة جديدة
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category
  });
});

// @desc    تحديث فئة
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`الفئة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    category
  });
});

// @desc    حذف فئة
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`الفئة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  // التحقق من وجود منتجات في هذه الفئة
  const productsCount = await Product.countDocuments({ category: req.params.id });

  if (productsCount > 0) {
    return next(
      new ErrorResponse(
        `لا يمكن حذف الفئة لأنها تحتوي على ${productsCount} منتج/منتجات. قم بنقل المنتجات إلى فئة أخرى أولاً`,
        400
      )
    );
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الفئة بنجاح'
  });
});

// @desc    تغيير حالة الفئة (نشط/غير نشط)
// @route   PATCH /api/categories/:id/status
// @access  Private/Admin
exports.toggleCategoryStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return next(new ErrorResponse('يجب توفير حالة النشاط (isActive) كقيمة منطقية', 400));
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );

  if (!category) {
    return next(new ErrorResponse(`الفئة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    category
  });
});

// @desc    البحث عن فئات
// @route   GET /api/categories/search
// @access  Public
exports.searchCategories = asyncHandler(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return next(new ErrorResponse('يرجى توفير كلمة بحث', 400));
  }

  const query = {
    name: { $regex: keyword, $options: 'i' }
  };

  // عرض الفئات النشطة فقط للمستخدمين العاديين
  if (!req.user || req.user.role !== 'admin') {
    query.isActive = true;
  }

  const categories = await Category.find(query).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    الحصول على الفئات المميزة
// @route   GET /api/categories/featured
// @access  Public
exports.getFeaturedCategories = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  const query = {
    featured: true,
    isActive: true
  };

  const categories = await Category.find(query)
    .limit(limit)
    .sort({ order: 1, name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    الحصول على إحصائيات الفئات
// @route   GET /api/categories/stats
// @access  Private/Admin
exports.getCategoryStats = asyncHandler(async (req, res, next) => {
  // الإحصائيات العامة
  const totalCategories = await Category.countDocuments();
  const activeCategories = await Category.countDocuments({ isActive: true });
  const featuredCategories = await Category.countDocuments({ featured: true });

  // الفئات الأكثر شيوعًا (مع عدد المنتجات)
  const topCategories = await Category.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        imageUrl: 1,
        isActive: 1,
        productCount: { $size: '$products' }
      }
    },
    { $sort: { productCount: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalCategories,
      activeCategories,
      featuredCategories,
      topCategories
    }
  });
});