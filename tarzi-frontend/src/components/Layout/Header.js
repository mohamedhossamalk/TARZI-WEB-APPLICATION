import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // أنماط CSS داخلية
  const styles = {
    header: {
      backgroundColor: '#212529',
      color: 'white',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      direction: 'rtl'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    logo: {
      width: '30px',
      height: '30px',
      marginLeft: '0.5rem'
    },
    navToggle: {
      display: 'none',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      '@media (max-width: 992px)': {
        display: 'block'
      }
    },
    navMenu: {
      display: 'flex',
      '@media (max-width: 992px)': {
        flexDirection: 'column',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#212529',
        padding: '1rem',
        display: menuOpen ? 'flex' : 'none'
      }
    },
    navGroup: {
      display: 'flex',
      '@media (max-width: 992px)': {
        flexDirection: 'column',
        width: '100%'
      }
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      '&:hover': {
        color: '#f8f9fa'
      }
    },
    badge: {
      backgroundColor: '#dc3545',
      color: 'white',
      borderRadius: '50%',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      marginRight: '0.5rem'
    },
    button: {
      backgroundColor: 'transparent',
      color: 'white',
      border: '1px solid white',
      borderRadius: '4px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
      marginRight: '0.5rem'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <img
            src="/logo.png"
            style={styles.logo}
            alt="TARZI Logo"
          />
          ترزي
        </Link>

        <button
          style={{
            ...styles.navToggle,
            display: window.innerWidth <= 992 ? 'block' : 'none'
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav
          style={{
            ...styles.navMenu,
            display: window.innerWidth <= 992
              ? (menuOpen ? 'flex' : 'none')
              : 'flex'
          }}
        >
          <div style={styles.navGroup}>
            <Link to="/" style={styles.navLink}>الرئيسية</Link>
            <Link to="/products" style={styles.navLink}>المنتجات</Link>
            <Link to="/services" style={styles.navLink}>الخدمات</Link>
            <Link to="/about" style={styles.navLink}>من نحن</Link>
            <Link to="/contact" style={styles.navLink}>اتصل بنا</Link>
          </div>

          <div style={styles.navGroup}>
            {isAuthenticated ? (
              <>
                <Link to="/cart" style={styles.navLink}>
                  السلة
                  <span style={styles.badge}>0</span>
                </Link>
                <Link to="/dashboard" style={styles.navLink}>لوحة التحكم</Link>
                <Link to="/profile" style={styles.navLink}>{user.name}</Link>
                <button
                  style={styles.button}
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.navLink}>تسجيل الدخول</Link>
                <Link to="/register" style={styles.navLink}>إنشاء حساب</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;