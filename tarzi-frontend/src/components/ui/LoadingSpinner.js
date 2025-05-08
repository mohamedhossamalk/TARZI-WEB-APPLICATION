// src/components/UI/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = 'جاري التحميل...' }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      padding: '2rem'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderTopColor: '#0d6efd',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    message: {
      marginTop: '1rem',
      fontSize: '1rem',
      color: '#666',
      fontFamily: 'Cairo, Arial, sans-serif'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;