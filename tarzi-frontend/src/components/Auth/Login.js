import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // الحصول على المسار المستهدف بعد تسجيل الدخول (إذا تم تحويل المستخدم)
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const sessionExpired = searchParams.get('message') === 'session_expired';

  // التوجيه تلقائيًا إذا كان المستخدم مسجل الدخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

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
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
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
    inputError: {
      borderColor: '#dc3545'
    },
    fieldError: {
      color: '#dc3545',
      fontSize: '0.85rem',
      marginTop: '0.25rem'
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionAttempted(true);
    
    // التحقق من صحة البيانات
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(formData);
      if (success) {
        // عرض رسالة نجاح قصيرة قبل إعادة التوجيه
        setTimeout(() => {
          navigate(redirectPath);
        }, 500);
      }
    } catch (err) {
      console.error('خطأ أثناء محاولة تسجيل الدخول:', err);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من البيانات المدخلة
  const formErrors = submissionAttempted ? validateForm() : {};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>تسجيل الدخول</h2>
        
        {sessionExpired && (
          <div style={styles.warning}>
            انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.
          </div>
        )}
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.email ? styles.inputError : {})
              }}
              placeholder="أدخل بريدك الإلكتروني"
            />
            {formErrors.email && (
              <p style={styles.fieldError}>{formErrors.email}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.password ? styles.inputError : {})
              }}
              placeholder="أدخل كلمة المرور"
            />
            {formErrors.password && (
              <p style={styles.fieldError}>{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>
            <Link to="/auth/forgotpassword" style={styles.link}>
              نسيت كلمة المرور؟
            </Link>
          </p>
          <p>
            ليس لديك حساب؟{' '}
            <Link to="/register" style={styles.link}>
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;