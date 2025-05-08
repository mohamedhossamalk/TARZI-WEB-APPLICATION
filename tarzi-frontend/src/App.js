// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductsList from './components/Products/ProductsList';
import ProductDetail from './components/Products/ProductDetail';
import Dashboard from './components/admin/Dashboard';
import Profile from './components/User/Profile';
import Cart from './components/Cart/Cart';
import Checkout from './components/Cart/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ForgotPassword from './components/Auth/ForgotPassword';

// مكون الحماية للمسارات التي تتطلب تسجيل الدخول
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh'
    }}>جاري التحميل...</div>;
  }
  
  if (!user) {
    // تخزين المسار المطلوب للعودة إليه بعد تسجيل الدخول
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} />;
  }
  
  return children;
};

function AppContent() {
  // الأنماط العامة للتطبيق
  const styles = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: 'Cairo, Arial, sans-serif',
      direction: 'rtl'
    },
    mainContent: {
      flexGrow: 1
    }
  };

  const { user } = useAuth();

  return (
    <div style={styles.appContainer}>
      <Header />
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* مسارات المصادقة */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/auth/forgotpassword" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          
          {/* مسارات عامة */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* مسارات محمية تتطلب تسجيل الدخول */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          
          {/* مسار 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;