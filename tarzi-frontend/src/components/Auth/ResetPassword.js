// src/components/Auth/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  // التحقق من صلاحية التوكن قبل عرض النموذج
  useEffect(() => {
    if (!token) {
      setError('رمز إعادة تعيين كلمة المرور غير صالح.');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمتي المرور
    if (formData.newPassword !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      return;
    }
    
    // التحقق من طول كلمة المرور
    if (formData.newPassword.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await resetPassword({
        token,
        newPassword: formData.newPassword
      });
      
      if (result.success) {
        setMessage('تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.');
        
        // إعادة التوجيه إلى صفحة تسجيل الدخول بعد فترة قصيرة
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور.');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      console.error('خطأ في إعادة تعيين كلمة المرور:', err);
    } finally {
      setLoading(false);
    }
  };

  // أنماط CSS داخلية
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl'
    },
    card: {
      width: '400px',
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    header: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#333',
      fontSize: '1.8rem'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '1rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    footer: {
      textAlign: 'center',
      marginTop: '1rem'
    },
    link: {
      color: '#0d6efd',
      textDecoration: 'none'
    }
  };

  if (error && !token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.header}>إعادة تعيين كلمة المرور</h2>
          <div style={styles.error}>{error}</div>
          <div style={styles.footer}>
            <Link to="/auth/forgotpassword" style={styles.link}>
              طلب رابط جديد لإعادة تعيين كلمة المرور
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>إعادة تعيين كلمة المرور</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>كلمة المرور الجديدة</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'جاري المعالجة...' : 'إعادة تعيين كلمة المرور'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>
            <Link to="/login" style={styles.link}>
              العودة إلى تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;