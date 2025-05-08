import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  // أنماط CSS داخلية
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '3rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    icon: {
      fontSize: '5rem',
      color: '#28a745',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '1.5rem'
    },
    orderNumber: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1.5rem',
      fontSize: '1.2rem'
    },
    message: {
      color: '#666',
      marginBottom: '2rem',
      lineHeight: '1.6'
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
      display: 'inline-block',
      margin: '0 0.5rem'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      margin: '0 0.5rem'
    },
    buttonsContainer: {
      marginBottom: '2rem'
    },
    section: {
      marginTop: '3rem',
      textAlign: 'right'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '1rem'
    },
    infoBox: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    infoRow: {
      display: 'flex',
      marginBottom: '0.5rem'
    },
    infoLabel: {
      fontWeight: 'bold',
      width: '150px'
    },
    steps: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
      position: 'relative'
    },
    step: {
      textAlign: 'center',
      flex: 1,
      position: 'relative',
      zIndex: 1
    },
    stepIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#0d6efd',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 0.5rem'
    },
    stepLabel: {
      color: '#333',
      fontSize: '0.875rem'
    },
    stepLine: {
      position: 'absolute',
      top: '20px',
      left: '60px',
      right: '60px',
      height: '2px',
      backgroundColor: '#ddd',
      zIndex: 0
    }
  };

  // رقم طلب عشوائي
  const orderNumber = 'ORD' + Math.floor(100000 + Math.random() * 900000);
  
  // تاريخ الطلب الحالي
  const orderDate = new Date().toLocaleDateString('ar-EG');
  
  return (
    <div style={styles.container}>
      <div style={styles.icon}>✓</div>
      <h1 style={styles.title}>تم استلام طلبك بنجاح</h1>
      
      <div style={styles.orderNumber}>
        <div>رقم الطلب</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{orderNumber}</div>
      </div>
      
      <p style={styles.message}>
        شكراً لاختيارك ترزي! تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.
        <br />
        سنقوم بإرسال تأكيد عبر البريد الإلكتروني مع تفاصيل الطلب.
      </p>
      
      <div style={styles.buttonsContainer}>
        <Link to="/dashboard" style={styles.button}>
          متابعة الطلب
        </Link>
        <Link to="/" style={styles.secondaryButton}>
          العودة للرئيسية
        </Link>
      </div>
      
      <div style={styles.steps}>
        <div style={styles.stepLine}></div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>1</div>
          <div style={styles.stepLabel}>استلام الطلب</div>
        </div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>2</div>
          <div style={styles.stepLabel}>تجهيز الطلب</div>
        </div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>3</div>
          <div style={styles.stepLabel}>تم الشحن</div>
        </div>
        <div style={styles.step}>
          <div style={styles.stepIcon}>4</div>
          <div style={styles.stepLabel}>تم التوصيل</div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>معلومات الطلب</h2>
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>رقم الطلب:</div>
            <div>{orderNumber}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>تاريخ الطلب:</div>
            <div>{orderDate}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>طريقة الدفع:</div>
            <div>الدفع عند الاستلام</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>حالة الطلب:</div>
            <div>تم الاستلام</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>التوصيل المتوقع:</div>
            <div>خلال 3-5 أيام عمل</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;