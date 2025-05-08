// src/routes.js
import React from 'react';

// صفحات عامة
const HomePage = React.lazy(() => import('./features/products/pages/HomePage'));
const ProductsPage = React.lazy(() => import('./features/products/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./features/products/pages/ProductDetailPage'));
const NotFoundPage = React.lazy(() => import('./common/components/NotFoundPage'));

// صفحات المصادقة
const LoginPage = React.lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./features/auth/pages/ResetPasswordPage'));

// صفحات محمية
const CartPage = React.lazy(() => import('./features/cart/pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./features/orders/pages/CheckoutPage'));
const OrdersPage = React.lazy(() => import('./features/orders/pages/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('./features/orders/pages/OrderDetailPage'));
const ProfilePage = React.lazy(() => import('./features/profile/pages/ProfilePage'));
const MeasurementsPage = React.lazy(() => import('./features/measurements/pages/MeasurementsPage'));
const ServicesPage = React.lazy(() => import('./features/services/pages/ServicesPage'));
const ServiceDetailPage = React.lazy(() => import('./features/services/pages/ServiceDetailPage'));
const NotificationsPage = React.lazy(() => import('./features/notifications/pages/NotificationsPage'));

// صفحات المسؤول
const DashboardPage = React.lazy(() => import('./features/admin/pages/DashboardPage'));
const ProductsAdminPage = React.lazy(() => import('./features/admin/pages/ProductsAdminPage'));
const CategoriesAdminPage = React.lazy(() => import('./features/admin/pages/CategoriesAdminPage'));
const OrdersAdminPage = React.lazy(() => import('./features/admin/pages/OrdersAdminPage'));
const UsersAdminPage = React.lazy(() => import('./features/admin/pages/UsersAdminPage'));
const SettingsAdminPage = React.lazy(() => import('./features/admin/pages/SettingsAdminPage'));

const routes = {
  // المسارات العامة المتاحة للجميع
  publicRoutes: [
    { path: "/", element: <HomePage /> },
    { path: "/products", element: <ProductsPage /> },
    { path: "/products/:id", element: <ProductDetailPage /> },
    { path: "/services", element: <ServicesPage /> },
    { path: "/services/:id", element: <ServiceDetailPage /> },
    { path: "/not-found", element: <NotFoundPage /> },
  ],
  
  // مسارات المصادقة
  authRoutes: [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  ],
  
  // المسارات المحمية (تتطلب تسجيل الدخول)
  protectedRoutes: [
    { path: "/cart", element: <CartPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/orders/:id", element: <OrderDetailPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/measurements", element: <MeasurementsPage /> },
    { path: "/my-services", element: <ServicesPage isMyServices={true} /> },
    { path: "/notifications", element: <NotificationsPage /> },
  ],
  
  // مسارات لوحة الإدارة (تتطلب صلاحيات المسؤول)
  adminRoutes: [
    { path: "/admin", element: <DashboardPage /> },
    { path: "/admin/products", element: <ProductsAdminPage /> },
    { path: "/admin/categories", element: <CategoriesAdminPage /> },
    { path: "/admin/orders", element: <OrdersAdminPage /> },
    { path: "/admin/users", element: <UsersAdminPage /> },
    { path: "/admin/settings", element: <SettingsAdminPage /> },
  ]
};

export default routes;