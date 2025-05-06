const Measurement = require('../models/Measurement');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على جميع مقاسات المستخدم
// @route   GET /api/measurements
// @access  Private
exports.getAllMeasurements = asyncHandler(async (req, res, next) => {
  const measurements = await Measurement.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    count: measurements.length,
    measurements
  });
});

// @desc    الحصول على مقاس محدد
// @route   GET /api/measurements/:id
// @access  Private
exports.getMeasurementById = asyncHandler(async (req, res, next) => {
  const measurement = await Measurement.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!measurement) {
    return next(new ErrorResponse(`المقاس غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    measurement
  });
});

// @desc    إنشاء مقاس جديد
// @route   POST /api/measurements
// @access  Private
exports.createMeasurement = asyncHandler(async (req, res, next) => {
  // إضافة معرف المستخدم
  req.body.userId = req.user.id;

  // التحقق من كون هذا هو أول مقاس للمستخدم
  const userMeasurementsCount = await Measurement.countDocuments({ userId: req.user.id });
  
  // إذا كان هذا هو أول مقاس، اجعله افتراضيًا
  if (userMeasurementsCount === 0) {
    req.body.isDefault = true;
  }

  const measurement = await Measurement.create(req.body);

  res.status(201).json({
    success: true,
    measurement
  });
});

// @desc    تحديث مقاس
// @route   PUT /api/measurements/:id
// @access  Private
exports.updateMeasurement = asyncHandler(async (req, res, next) => {
  let measurement = await Measurement.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!measurement) {
    return next(new ErrorResponse(`المقاس غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  // منع تعديل معرف المستخدم
  if (req.body.userId) {
    delete req.body.userId;
  }

  // تحديث المقاس
  measurement = await Measurement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    measurement
  });
});

// @desc    حذف مقاس
// @route   DELETE /api/measurements/:id
// @access  Private
exports.deleteMeasurement = asyncHandler(async (req, res, next) => {
  const measurement = await Measurement.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!measurement) {
    return next(new ErrorResponse(`المقاس غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  // منع حذف المقاس الافتراضي إذا كان هناك مقاس واحد فقط
  const userMeasurementsCount = await Measurement.countDocuments({ userId: req.user.id });
  
  if (userMeasurementsCount === 1 && measurement.isDefault) {
    return next(new ErrorResponse('لا يمكن حذف المقاس الوحيد', 400));
  }

  // إذا كان المقاس المراد حذفه هو الافتراضي، قم بتعيين مقاس آخر كافتراضي
  if (measurement.isDefault) {
    const anotherMeasurement = await Measurement.findOne({
      userId: req.user.id,
      _id: { $ne: req.params.id }
    });
    
    if (anotherMeasurement) {
      anotherMeasurement.isDefault = true;
      await anotherMeasurement.save();
    }
  }

  await measurement.deleteOne();

  res.status(200).json({
    success: true,
    message: 'تم حذف المقاس بنجاح'
  });
});

// @desc    تعيين مقاس كافتراضي
// @route   PUT /api/measurements/:id/default
// @access  Private
exports.setDefaultMeasurement = asyncHandler(async (req, res, next) => {
  // التحقق من وجود المقاس
  const measurement = await Measurement.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!measurement) {
    return next(new ErrorResponse(`المقاس غير موجود بالمعرف: ${req.params.id}`, 404));
  }

  // إذا كان المقاس هو الافتراضي بالفعل، لا حاجة للتغيير
  if (measurement.isDefault) {
    return res.status(200).json({
      success: true,
      message: 'هذا المقاس هو الافتراضي بالفعل',
      measurement
    });
  }

  // إلغاء تعيين المقاس الافتراضي السابق
  await Measurement.updateMany(
    { userId: req.user.id, isDefault: true },
    { isDefault: false }
  );

  // تعيين المقاس الجديد كافتراضي
  measurement.isDefault = true;
  await measurement.save();

  res.status(200).json({
    success: true,
    message: 'تم تعيين المقاس كافتراضي بنجاح',
    measurement
  });
});