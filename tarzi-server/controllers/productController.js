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
// إضافة منتج جديد
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount || 0,
      category: req.body.category,
      images: req.body.images || [],
      stock: req.body.stock || 0,
      specifications: req.body.specifications || [],
      featured: req.body.featured || false,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const product = await Product.create(productData);
    
    // تسجيل نشاط إضافة المنتج
    await ActivityLog.create({
      user: req.user._id,
      action: 'create',
      entity: 'Product',
      entityId: product._id,
      details: `Added new product: ${product.name}`
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    تحديث منتج
// @route   PUT /api/products/:id
// @access  Private/Admin
// تحديث منتج موجود
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // التأكد من وجود المنتج
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    );
    
    // تسجيل نشاط تحديث المنتج
    await ActivityLog.create({
      user: req.user._id,
      action: 'update',
      entity: 'Product',
      entityId: updatedProduct._id,
      details: `Updated product: ${updatedProduct.name}`
    });

    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }
    
    // حذف المنتج
    await Product.findByIdAndDelete(req.params.id);
    
    // تسجيل نشاط حذف المنتج
    await ActivityLog.create({
      user: req.user._id,
      action: 'delete',
      entity: 'Product',
      entityId: req.params.id,
      details: `Deleted product: ${product.name}`
    });
    
    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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


// تحميل صور للمنتج
exports.uploadProductImages = async (req, res) => {
  try {
    // استخدام مكتبة multer لرفع الصور
    // ثم تخزينها في مكان مناسب (منصة سحابية أو المخدم المحلي)

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    
    res.status(200).json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// تحديث حالة المنتج (نشط/غير نشط)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};