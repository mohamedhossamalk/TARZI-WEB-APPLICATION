import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// الصفحات الرئيسية
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// صفحات المصادقة
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// صفحة لوحة التحكم الرئيسية
import Dashboard from './pages/admin/DashboardPage';

// التخطيطات
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import ErrorPage from './pages/ErrorPage';

// مكون المسار المحمي للمستخدم العادي
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!userInfo) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مصادقًا
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  return children;
};

// مكون المسار المحمي للمسؤول
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!userInfo) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مصادقًا
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  if (userInfo.role !== 'admin' && userInfo.role !== 'superadmin') {
    // إعادة توجيه المستخدم إلى الصفحة الرئيسية إذا لم يكن مسؤولًا
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* مسارات واجهة المستخدم */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* مسارات المستخدم المسجل */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* مسارات المصادقة */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* مسار لوحة تحكم المسؤول */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* مسارات أخرى للوحة التحكم يمكنك إضافتها لاحقاً */}
      </Route>

      {/* مسار غير موجود */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
