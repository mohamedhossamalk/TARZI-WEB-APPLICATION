// src/features/auth/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const LoginPage = () => <div>صفحة تسجيل الدخول</div>;
const RegisterPage = () => <div>صفحة إنشاء حساب</div>;
const ForgotPasswordPage = () => <div>صفحة نسيت كلمة المرور</div>;
const ResetPasswordPage = () => <div>صفحة إعادة تعيين كلمة المرور</div>;

export const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
];

export default authRoutes;