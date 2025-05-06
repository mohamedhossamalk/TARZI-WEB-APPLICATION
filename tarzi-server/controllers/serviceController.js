const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع الخدمات المهنية
// @route   GET /api/professionalservices
// @access  Public
exports.getAllServices = asyncHandler(async (req, res, next) => {
  // الاستعلام
  let query = { availability: true };

  // البحث
  if (req.query.keyword) {
    query.title = { $regex: req.query.keyword, $options: 'i' };
  }

  // التصفية حسب الفئة
  if (req.query.category) {
    query.category = req.query.category;
  }

  // عدد العناصر لكل صفحة
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;

  // تنفيذ الاستعلام
  const total = await Service.countDocuments(query);
  const services = await Service.find(query)
    .populate('userId', 'username')
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  // إرسال الاستجابة
  res.status(200).json({
    success: true,
    count: services.length,
    pagination: {
      page,
      pages: Math.ceil(total / pageSize),
      total
    },
    services
  });
});

// @desc    الحصول على خدماتي المهنية
// @route   GET /api/professionalservices/myservices
// @access  Private
exports.getMyServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    services
  });
});

// @desc    الحصول على خدمة محددة
// @route   GET /api/professionalservices/:id
// @access  Public
exports.getServiceById = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id)
    .populate('userId', 'username email phone');

  if (!service) {
    return next(new ErrorResponse(`الخدمة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    service
  });
});

// @desc    إنشاء خدمة مهنية جديدة
// @route   POST /api/professionalservices
// @access  Private
exports.createService = asyncHandler(async (req, res, next) => {
  // التحقق من أن المستخدم له دور "professional"
  if (req.user.role !== 'professional' && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح للمستخدمين العاديين بإنشاء خدمات مهنية', 403));
  }

  // إضافة معرف المستخدم
  req.body.userId = req.user.id;

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    service
  });
});

// @desc    تحديث خدمة مهنية
// @route   PUT /api/professionalservices/:id
// @access  Private
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`الخدمة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  // التحقق من ملكية الخدمة أو كون المستخدم مسؤولاً
  if (service.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح لك بتحديث هذه الخدمة', 403));
  }

  // منع تغيير المستخدم المالك
  if (req.body.userId) {
    delete req.body.userId;
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    service
  });
});

// @desc    حذف خدمة مهنية
// @route   DELETE /api/professionalservices/:id
// @access  Private
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`الخدمة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  // التحقق من ملكية الخدمة أو كون المستخدم مسؤولاً
  if (service.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح لك بحذف هذه الخدمة', 403));
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف الخدمة بنجاح'
  });
});

// @desc    طلب خدمة مهنية
// @route   POST /api/professionalservices/:id/request
// @access  Private
exports.requestService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`الخدمة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  // التحقق من توفر الخدمة
  if (!service.availability) {
    return next(new ErrorResponse('هذه الخدمة غير متاحة حاليًا', 400));
  }

  // منع طلب خدمة المستخدم نفسه
  if (service.userId.toString() === req.user.id) {
    return next(new ErrorResponse('لا يمكنك طلب خدمتك الخاصة', 400));
  }

  // إنشاء طلب الخدمة
  const serviceRequest = {
    serviceId: service._id,
    clientId: req.user.id,
    providerId: service.userId,
    details: req.body.details,
    preferredDate: req.body.preferredDate,
    budget: req.body.budget,
    status: 'pending'
  };

  // هنا يمكن إنشاء نموذج منفصل للطلبات أو استخدام الإشعارات

  // إرسال إشعار إلى مقدم الخدمة
  // سيتم تنفيذه في وحدة الإشعارات

  res.status(201).json({
    success: true,
    message: 'تم إرسال طلب الخدمة بنجاح',
    request: serviceRequest
  });
});

// @desc    تقييم خدمة
// @route   POST /api/professionalservices/:id/review
// @access  Private
exports.reviewService = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new ErrorResponse('يرجى توفير تقييم صالح بين 1 و 5', 400));
  }

  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`الخدمة غير موجودة بالمعرف: ${req.params.id}`, 404));
  }

  // هنا يمكن التحقق من أن المستخدم قام بطلب هذه الخدمة بالفعل
  // سيتطلب ذلك نموذج منفصل للطلبات أو تتبع الطلبات المكتملة

  // إضافة التقييم
  const review = {
    userId: req.user.id,
    rating,
    comment: comment || '',
    createdAt: Date.now()
  };

  // إضافة التقييم إلى الخدمة (تحتاج إلى تعديل نموذج الخدمة لدعم التقييمات المتعددة)
  service.reviews = service.reviews || [];
  service.reviews.push(review);

  // تحديث متوسط التقييم
  const totalRatings = service.reviews.length;
  const ratingSum = service.reviews.reduce((sum, review) => sum + review.rating, 0);
  service.rating = parseFloat((ratingSum / totalRatings).toFixed(1));

  await service.save();

  res.status(200).json({
    success: true,
    message: 'تم إضافة التقييم بنجاح',
    service
  });
});