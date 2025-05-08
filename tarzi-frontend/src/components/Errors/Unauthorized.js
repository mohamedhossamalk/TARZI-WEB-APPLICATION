// src/components/Errors/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  const styles = {
    container: {
      padding: '3rem 1rem',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'Cairo, Arial, sans-serif'
    },
    icon: {
      fontSize: '4rem',
      color: '#dc3545',
      marginBottom: '1rem'
    },
    title: {
      color: '#333',
      fontSize: '2rem',
      marginBottom: '1rem'
    },
    message: {
      color: '#666',
      marginBottom: '2rem'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0d6efd',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
      fontSize: '1rem',
      textDecoration: 'none',
      display: 'inline-block',
      marginRight: '1rem'
    },
    linkButton: {
      padding: '10px 20px',
      backgroundColor: 'transparent',
      color: '#0d6efd',
      borderRadius: '4px',
      border: '1px solid #0d6efd',
      fontSize: '1rem',
      textDecoration: 'none',
      display: 'inline-block'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>🔒</div>
      <h1 style={styles.title}>غير مصرح بالوصول</h1>
      <p style={styles.message}>
        عذراً، ليس لديك الصلاحية اللازمة للوصول إلى هذه الصفحة.
        <br />
        يرجى التواصل مع المسؤول إذا كنت تعتقد أنه يجب أن يكون لديك وصول.
      </p>
      <div>
        <Link to="/" style={styles.button}>العودة للصفحة الرئيسية</Link>
        <Link to="/contact" style={styles.linkButton}>تواصل معنا</Link>
      </div>
    </div>
  );
};

export default Unauthorized;