import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  // أنماط CSS داخلية
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '70vh',
      textAlign: 'center',
      padding: '0 1rem',
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl'
    },
    errorCode: {
      fontSize: '8rem',
      fontWeight: 'bold',
      color: '#0d6efd',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '1.5rem'
    },
    message: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '2rem',
      maxWidth: '600px'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.errorCode}>404</div>
      <h1 style={styles.title}>الصفحة غير موجودة</h1>
      <p style={styles.message}>
        عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو تغيير اسمها أو حذفها.
      </p>
      <Link to="/" style={styles.button}>
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;