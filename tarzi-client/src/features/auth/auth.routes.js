// src/features/auth/auth.routes.js
import React from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// يمكنك إما إزالة المسارات غير الموجودة، أو إنشاء مكونات مؤقتة لها
const ProfessionalSignupPage = () => <div>صفحة تسجيل المحترف (قيد الإنشاء)</div>;
const EmailVerificationPage = () => <div>صفحة تأكيد البريد الإلكتروني (قيد الإنشاء)</div>;

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/professional-signup", element: <ProfessionalSignupPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "/verify-email/:token", element: <EmailVerificationPage /> },
];

export default authRoutes;