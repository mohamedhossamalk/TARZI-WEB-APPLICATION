// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // إذا لم يكن المستخدم مسجل الدخول، يتم توجيهه إلى صفحة تسجيل الدخول
    // مع حفظ الموقع الحالي للعودة إليه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // إذا كانت الصفحة تتطلب صلاحيات مسؤول، يتم التحقق من دور المستخدم
  if (requireAdmin && user?.role !== 'admin') {
    // إذا لم يكن المستخدم مسؤولاً، يتم توجيهه إلى الصفحة الرئيسية
    return <Navigate to="/" replace />;
  }
  
  // إذا مر المستخدم من التحققات السابقة، يتم عرض المحتوى المطلوب
  return <Outlet />;
};