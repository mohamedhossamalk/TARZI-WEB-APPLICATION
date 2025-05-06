const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const jwtUtils = require('../utils/jwtUtils');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, phone } = req.body;

  // التحقق من وجود المستخدم
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('البريد الإلكتروني مسجل بالفعل', 400));
  }

  // إنشاء المستخدم
  const user = await User.create({
    username,
    email,
    password,
    phone
  });

  // إنشاء رمز التوثيق
  const token = jwtUtils.generateToken(user._id);

  // إزالة كلمة المرور من الإستجابة
  user.password = undefined;

  res.status(201).json({
    success: true,
    token,
    user
  });
});

// @desc    تسجيل دخول المستخدم
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // التحقق من وجود البريد الإلكتروني وكلمة المرور
  if (!email || !password) {
    return next(new ErrorResponse('يرجى توفير البريد الإلكتروني وكلمة المرور', 400));
  }

  // التحقق من وجود المستخدم
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('بيانات الاعتماد غير صالحة', 401));
  }

  // التحقق من نشاط الحساب
  if (!user.isActive) {
    return next(new ErrorResponse('هذا الحساب غير نشط. يرجى الاتصال بالدعم', 401));
  }

  // التحقق من كلمة المرور
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('بيانات الاعتماد غير صالحة', 401));
  }

  // إنشاء رمز التوثيق
  const token = jwtUtils.generateToken(user._id);

  // إزالة كلمة المرور من الإستجابة
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    user
  });
});

// @desc    الحصول على بيانات المستخدم الحالي
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    تحديث بيانات المستخدم
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { username, phone, address } = req.body;

  const updatedFields = {
    username,
    phone,
    address
  };

  // إزالة الحقول الفارغة
  Object.keys(updatedFields).forEach(key => 
    (updatedFields[key] === undefined || updatedFields[key] === null) && delete updatedFields[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    تغيير كلمة المرور
// @route   PUT /api/auth/changepassword
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // التحقق من كلمة المرور الحالية
  const isMatch = await user.matchPassword(req.body.currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('كلمة المرور الحالية غير صحيحة', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = jwtUtils.generateToken(user._id);

  res.status(200).json({
    success: true,
    token
  });
});

// @desc    نسيان كلمة المرور
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('لا يوجد مستخدم بهذا البريد الإلكتروني', 404));
  }

  // إنشاء رمز إعادة تعيين
  const resetToken = crypto.randomBytes(20).toString('hex');

  // تخزين رمز إعادة التعيين المشفر في قاعدة البيانات
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // تعيين وقت انتهاء الصلاحية (10 دقائق)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // إنشاء رابط إعادة التعيين
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  const message = `
    لقد طلبت إعادة تعيين كلمة المرور. الرجاء استخدام الرابط التالي لإعادة تعيين كلمة المرور: \n\n
    ${resetUrl} \n\n
    هذا الرابط صالح لمدة 10 دقائق فقط. إذا لم تطلب إعادة تعيين كلمة المرور، فيرجى تجاهل هذه الرسالة.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'إعادة تعيين كلمة المرور - منصة ترزي',
      message
    });

    res.status(200).json({
      success: true,
      message: 'تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('لا يمكن إرسال البريد الإلكتروني', 500));
  }
});

// @desc    إعادة تعيين كلمة المرور
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // الحصول على الرمز المشفر
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('رمز غير صالح أو منتهي الصلاحية', 400));
  }

  // تعيين كلمة المرور الجديدة
  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // إنشاء رمز التوثيق
  const token = jwtUtils.generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    message: 'تم إعادة تعيين كلمة المرور بنجاح'
  });
});