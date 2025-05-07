// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Layout } from './components/layout/Layout';
import { GlobalStyles } from './styles/GlobalStyles'; // تم تغيير المسار لتجنب مشاكل SASS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// الصفحات الأساسية - نستورها مباشرة لأنها بسيطة
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// استخدام التحميل البطيء للمكونات الأخرى لتحسين الأداء وتقليل المشاكل
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));
const ProductsPage = lazy(() => import('./features/products/pages/ProductsPage'));

// إضافة صفحات جديدة بتحميل بطيء
const ProductDetailPage = lazy(() => import('./features/products/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const ProfilePage = lazy(() => import('./features/auth/pages/ProfilePage'));
const MeasurementsPage = lazy(() => import('./features/measurements/pages/MeasurementsPage'));
const CustomizeSuitPage = lazy(() => import('./features/customize/pages/CustomizeSuitPage'));
const CheckoutPage = lazy(() => import('./features/checkout/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./features/orders/pages/OrdersPage'));

// مكون الحماية البديل المؤقت
const TempProtectedRoute = ({ children }) => {
  // هنا يمكنك وضع منطق التحقق من تسجيل الدخول لاحقًا
  const isAuthenticated = localStorage.getItem('token') !== null; // تحقق بسيط من وجود رمز في التخزين المحلي
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// مكون صفحة قيد الإنشاء مع تحسينات بصرية
const UnderConstructionPage = () => (
  <div style={{ 
    padding: '60px 20px', 
    textAlign: 'center',
    backgroundColor: 'var(--grey-100)',
    borderRadius: '12px',
    margin: '40px auto',
    maxWidth: '800px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  }}>
    <div style={{
      width: '80px',
      height: '80px',
      margin: '0 auto 24px',
      backgroundColor: 'var(--primary)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    </div>
    <h2 style={{ 
      color: 'var(--primary)', 
      marginBottom: '16px',
      fontSize: '1.8rem'
    }}>
      الصفحة قيد التطوير
    </h2>
    <p style={{ 
      color: 'var(--text-secondary)',
      marginBottom: '28px',
      fontSize: '1.1rem',
      maxWidth: '500px',
      margin: '0 auto 28px'
    }}>
      نعمل حاليًا على إنشاء هذه الصفحة لتقديم تجربة مميزة لك. ستكون متاحة قريبًا!
    </p>
    <a 
      href="/"
      style={{
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: '600',
        display: 'inline-block',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-dark)'}
      onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary)'}
    >
      العودة إلى الصفحة الرئيسية
    </a>
  </div>
);

// مكون تحميل محسن
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    flexDirection: 'column'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid rgba(229, 57, 53, 0.1)',
      borderTop: '4px solid var(--primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }} />
    <p style={{ color: 'var(--text-secondary)' }}>جاري التحميل...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  // التمرير إلى أعلى الصفحة عند تغيير المسار
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    // تسجيل مستمع لتغيير العنوان
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      // إلغاء تسجيل المستمع عند إزالة المكون
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* المسارات العامة */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* المسارات المحمية (تتطلب تسجيل الدخول) */}
              <Route path="profile" element={<TempProtectedRoute><ProfilePage /></TempProtectedRoute>} />
              <Route path="measurements" element={<TempProtectedRoute><MeasurementsPage /></TempProtectedRoute>} />
              <Route path="customize" element={<TempProtectedRoute><CustomizeSuitPage /></TempProtectedRoute>} />
              <Route path="checkout" element={<TempProtectedRoute><CheckoutPage /></TempProtectedRoute>} />
              <Route path="orders" element={<TempProtectedRoute><OrdersPage /></TempProtectedRoute>} />
              
              {/* المسارات القادمة قريبًا */}
              <Route path="favorites" element={<TempProtectedRoute><UnderConstructionPage /></TempProtectedRoute>} />
              <Route path="order-tracking" element={<TempProtectedRoute><UnderConstructionPage /></TempProtectedRoute>} />
              
              {/* صفحة 404 (غير موجود) */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            
            {/* مسارات لوحة الإدارة - مؤقتًا نستخدم مكون بديل */}
            <Route path="/admin/*" element={<TempProtectedRoute><UnderConstructionPage /></TempProtectedRoute>} />
          </Routes>
        </Suspense>
      </Router>
      
      {/* مكون الإشعارات */}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </>
  );
}

export default App;
