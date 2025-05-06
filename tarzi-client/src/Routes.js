import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import MeasurementsPage from './pages/MeasurementsPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Protected route component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();
  
  console.log('ProtectedRoute check:', { isAuthenticated, user, roles });
  
  if (!isAuthenticated) {
    // حفظ مسار التوجيه المطلوب للعودة إليه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // للتطوير: إذا كان دور المستخدم غير محدد، افترض أنه مسؤول
  const userRole = user?.role || 'admin';
  
  // إذا كان المستخدم مصادق عليه وليس هناك أدوار مطلوبة أو مسموح بدور المستخدم
  if (roles.length === 0 || roles.includes(userRole)) {
    return children;
  }
  
  // المستخدم ليس لديه صلاحية
  return <Navigate to="/" />;
};

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  console.log('AdminRoute check:', { isAuthenticated, user });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // للتطوير: افترض دائمًا أن المستخدم مسؤول إذا لم يكن له دور محدد
  const userRole = user?.role || 'admin';
  
  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      
      {/* Protected routes */}
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
            <OrdersPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/measurements" 
        element={
          <ProtectedRoute>
            <MeasurementsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        } 
      />
      
      <Route 
        path="/admin/products" 
        element={
          <AdminRoute>
            <AdminProductsPage />
          </AdminRoute>
        } 
      />
      
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <AdminOrdersPage />
          </AdminRoute>
        } 
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;