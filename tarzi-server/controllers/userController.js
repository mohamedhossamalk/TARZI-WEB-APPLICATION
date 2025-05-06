const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    الحصول على الملف الشخصي للمستخدم الحالي
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    تحديث الملف الشخصي للمستخدم الحالي
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { username, phone, address } = req.body;

  const updateFields = {};
  
  if (username) updateFields.username = username;
  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    تحديث كلمة مرور المستخدم الحالي
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { currentPassword, newPassword } = req.body;

  // التحقق من كلمة المرور الحالية
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('كلمة المرور الحالية غير صحيحة', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'تم تحديث كلمة المرور بنجاح'
  });
});

// @desc    الحصول على عناوين المستخدم الحالي
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user.address ? [user.address] : []
  });
});

// @desc    إضافة عنوان جديد للمستخدم الحالي
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  // في هذه النسخة البسيطة، نفترض أن لكل مستخدم عنوان واحد فقط
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { address: req.body },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    data: user.address
  });
});

// @desc    تحديث عنوان المستخدم الحالي
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  // في هذه النسخة البسيطة، نتجاهل معرف العنوان لأن لدينا عنوان واحد فقط
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { address: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user.address
  });
});

// @desc    حذف عنوان المستخدم الحالي
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  // في هذه النسخة البسيطة، نحذف العنوان بالكامل
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $unset: { address: "" } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'تم حذف العنوان بنجاح'
  });
});

// === مسارات المسؤول ===

// @desc    الحصول على جميع المستخدمين
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    الحصول على مستخدم محدد
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`لا يوجد مستخدم بالمعرف ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    تحديث مستخدم
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return next(new ErrorResponse(`لا يوجد مستخدم بالمعرف ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    حذف مستخدم
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`لا يوجد مستخدم بالمعرف ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    message: 'تم حذف المستخدم بنجاح'
  });
});

// @desc    تغيير حالة المستخدم (نشط/غير نشط)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;
  
  if (typeof isActive !== 'boolean') {
    return next(new ErrorResponse('يرجى تحديد حالة المستخدم (نشط/غير نشط)', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );
  
  if (!user) {
    return next(new ErrorResponse(`لا يوجد مستخدم بالمعرف ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    تغيير دور المستخدم
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  
  if (!role || !['user', 'admin', 'professional'].includes(role)) {
    return next(new ErrorResponse('يرجى تحديد دور صالح (user, admin, professional)', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  
  if (!user) {
    return next(new ErrorResponse(`لا يوجد مستخدم بالمعرف ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});
