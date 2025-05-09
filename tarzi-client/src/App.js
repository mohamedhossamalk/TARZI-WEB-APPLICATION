// src/App.js
import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// التخطيطات
import MainLayout from './core/layouts/MainLayout';
import AuthLayout from './core/layouts/AuthLayout';
import AdminLayout from './core/layouts/AdminLayout';

// الهوكس
import { useAuth } from './core/hooks/useAuth';
import { useNotifications } from './core/hooks/useNotifications';

// التكوينات
import theme from './config/theme';

// المكونات
import LoadingScreen from './common/components/LoadingScreen';
import AdvancedLoadingScreen from './common/components/AdvancedLoadingScreen';
import ErrorBoundary from './common/components/ErrorBoundary';

// مسارات التطبيق - تصحيح الاستيرادات
import authRoutes from './features/auth/auth.routes';
import productRoutes from './features/products/products.routes'; 
import cartRoutes from './features/cart/cart.routes'; 
import orderRoutes from './features/orders/orders.routes';
import measurementRoutes from './features/measurements/measurements.routes';
import serviceRoutes from './features/services/services.routes';
import notificationRoutes from './features/notifications/notifications.routes';
import profileRoutes from './features/profile/profile.routes';
import adminRoutes from './features/admin/admin.routes';

// صفحات عامة
const HomePage = React.lazy(() => import('./features/products/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('./common/components/NotFoundPage'));

// إنشاء كاش للـ RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// تهيئة بنية المسارات الافتراضية
const defaultRouteStructure = {
  public: [],
  protected: []
};

const App = () => {
  const { isAuthenticated, isAdmin, isProfessional, loading: authLoading, checkAuthStatus } = useAuth();
  const { initializeNotifications } = useNotifications();
  const [appLoading, setAppLoading] = useState(true);

  // التحقق من حالة المصادقة عند تحميل التطبيق
  useEffect(() => {
    checkAuthStatus();
    
    // محاكاة تحميل موارد التطبيق
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [checkAuthStatus]);

  // تهيئة الإشعارات عند تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) {
      initializeNotifications();
    }
  }, [isAuthenticated, initializeNotifications]);

  // معالجة الحالات الخاصة للمسارات
  const getSafeRoutes = (routeModule) => {
    if (!routeModule) return defaultRouteStructure;
    
    // تحقق إذا كان المسار عبارة عن مصفوفة مسطحة
    if (Array.isArray(routeModule)) {
      return {
        public: [],
        protected: routeModule
      };
    }
    
    // إذا كان المسار يتبع البنية المتوقعة (public/protected)
    return routeModule;
  };

  // التأكد من وجود بنية المسارات الصحيحة
  const safeProductRoutes = getSafeRoutes(productRoutes);
  const safeServiceRoutes = getSafeRoutes(serviceRoutes);

  // عرض شاشة التحميل المتقدمة عند بدء التطبيق
  if (appLoading) {
    return <AdvancedLoadingScreen duration={2000} />;
  }

  // عرض شاشة التحميل أثناء التحقق من حالة المصادقة
  if (authLoading) {
    return <LoadingScreen message="جاري التحقق من حساب المستخدم..." />;
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* مسارات المصادقة */}
              <Route element={<AuthLayout />}>
                {authRoutes && authRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>
              
              {/* مسارات لوحة التحكم للمسؤولين */}
              <Route
                element={
                  isAuthenticated && isAdmin ? (
                    <AdminLayout />
                  ) : (
                    <Navigate to="/login" state={{ from: '/admin' }} replace />
                  )
                }
              >
                {adminRoutes && adminRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* المسارات العامة */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                
                {/* مسارات المنتجات العامة */}
                {safeProductRoutes.public && safeProductRoutes.public.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات الخدمات العامة */}
                {safeServiceRoutes.public && safeServiceRoutes.public.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                <Route path="/not-found" element={<NotFoundPage />} />
              </Route>

              {/* المسارات المحمية (تتطلب تسجيل الدخول) */}
              <Route
                element={
                  isAuthenticated ? (
                    <MainLayout />
                  ) : (
                    <Navigate to="/login" state={{ from: window.location.pathname }} replace />
                  )
                }
              >
                {/* مسارات المنتجات المحمية */}
                {safeProductRoutes.protected && safeProductRoutes.protected.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات سلة التسوق */}
                {cartRoutes && cartRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات الطلبات */}
                {orderRoutes && orderRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات المقاسات */}
                {measurementRoutes && measurementRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات الإشعارات */}
                {notificationRoutes && notificationRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* مسارات الملف الشخصي */}
                {profileRoutes && profileRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* مسارات الخدمات المهنية (تتطلب صلاحيات مهنية) */}
              <Route
                element={
                  isAuthenticated && isProfessional ? (
                    <MainLayout />
                  ) : (
                    <Navigate to="/login" state={{ from: window.location.pathname }} replace />
                  )
                }
              >
                {safeServiceRoutes.professional && safeServiceRoutes.professional.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* مسار غير موجود */}
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;