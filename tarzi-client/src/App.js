import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert, Button, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Routes from './Routes';
import { checkAuthStatus } from './store/actions/authActions';
import './assets/styles/App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { darkMode } = useSelector(state => state.theme || { darkMode: false });
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  
  // State for notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info', action: null });
  
  // RTL cache for Arabic language
  const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  
  // LTR cache for other languages
  const ltrCache = createCache({
    key: 'mui',
  });
  
  // تكوين الثيم
  const theme = createTheme({
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1e88e5',
      },
      secondary: {
        main: '#ff5722',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#fff',
      }
    },
    typography: {
      fontFamily: i18n.language === 'ar' 
        ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
          }
        }
      }
    },
  });
  
  // تحديد ما إذا كان المسار الحالي ينتمي إلى لوحة تحكم المسؤول
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // تحديد ما إذا كان المسار الحالي ينتمي إلى صفحات المصادقة
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    path => location.pathname.startsWith(path)
  );
  
  // مراقبة حالة المصادقة في التطبيق
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      // ضمان وجود دور المسؤول للتطوير
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        console.log('Fixing user role to admin for development...');
        const updatedUser = { ...user, role: 'admin' };
        
        // تحديث في localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // تحديث في Redux store
        dispatch({
          type: 'AUTH_LOGIN_SUCCESS',
          payload: { user: updatedUser, token: localStorage.getItem('token') }
        });
        
        setNotification({
          open: true,
          message: 'تم تحديث دور المستخدم إلى مسؤول (للتطوير)',
          severity: 'info'
        });
      }
    }
  }, [isAuthenticated, user, dispatch]);
  
  useEffect(() => {
    // تعيين اتجاه المستند حسب اللغة
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // تطبيق الوضع المظلم على العنصر الجذر
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // DEV ONLY: تسجيل دخول تلقائي كمسؤول إذا لم يكن هناك مستخدم مسجل
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('Checking auth state:', { token: !!token, user: !!userStr });
    
    try {
      if (!token || !userStr) {
        console.log('Auto login for development...');
        // للتطوير فقط: تسجيل دخول تلقائي
        const mockToken = 'mock_token_for_development';
        const mockUser = {
          _id: 'user123',
          username: 'مستخدم تجريبي',
          email: 'admin@example.com',
          role: 'admin', 
          isActive: true
        };
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Dispatch manual login
        dispatch({
          type: 'AUTH_LOGIN_SUCCESS',
          payload: { user: mockUser, token: mockToken }
        });
        
        setNotification({
          open: true,
          message: 'تم تسجيل الدخول تلقائياً كمسؤول (للتطوير)',
          severity: 'success',
          action: () => {
            navigate('/admin/dashboard');
          }
        });
        
        console.log('Auto login completed with user:', mockUser);
      } else {
        // محاولة تحليل بيانات المستخدم
        try {
          const parsedUser = JSON.parse(userStr);
          console.log('Existing user in localStorage:', parsedUser);
          
          // التأكد من وجود دور المسؤول للتطوير
          if (parsedUser && parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin') {
            console.log('User exists but is not admin, updating role...');
            parsedUser.role = 'admin';
            localStorage.setItem('user', JSON.stringify(parsedUser));
            
            // إعادة تعيين المستخدم في المخزن
            dispatch({
              type: 'AUTH_LOGIN_SUCCESS',
              payload: { user: parsedUser, token }
            });
            
            setNotification({
              open: true,
              message: 'تم تحديث دور المستخدم إلى مسؤول (للتطوير)',
              severity: 'info'
            });
          }
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          // إذا حدث خطأ في تحليل بيانات المستخدم، قم بإزالتها وإعادة تسجيل الدخول
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          const mockToken = 'mock_token_for_development';
          const mockUser = {
            _id: 'user123',
            username: 'مستخدم تجريبي',
            email: 'admin@example.com',
            role: 'admin',
            isActive: true
          };
          
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          dispatch({
            type: 'AUTH_LOGIN_SUCCESS',
            payload: { user: mockUser, token: mockToken }
          });
        }
        
        // التحقق من حالة المصادقة من الخادم
        dispatch(checkAuthStatus());
      }
    } catch (error) {
      console.error('Error in auto login process:', error);
    }
  }, [dispatch, i18n.language, navigate, darkMode]);
  
  // زر الانتقال مباشرة إلى لوحة التحكم للمساعدة في التطوير
  const handleGotoDashboard = () => {
    navigate('/admin/dashboard');
    handleCloseNotification();
  };
  
  // إغلاق الإشعار
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // إظهار شاشة التحميل أثناء عملية المصادقة
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <CircularProgress />
        <div>جاري تحميل التطبيق...</div>
      </div>
    );
  }

  // استخدام حاوية Cache مناسبة حسب اتجاه اللغة
  return (
    <CacheProvider value={i18n.language === 'ar' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`app ${isAdminRoute ? 'admin-app' : ''} ${isAuthRoute ? 'auth-app' : ''}`}>
          {/* مكونات Header و Footer يتم عرضها فقط في واجهة المستخدم العادية وليس في لوحة المسؤول أو صفحات المصادقة */}
          <main className={`main-content ${isAdminRoute ? 'admin-main-content' : ''} ${isAuthRoute ? 'auth-main-content' : ''}`}>
            <Routes />
          </main>
          
          {/* Notification */}
          <Snackbar 
            open={notification.open} 
            autoHideDuration={notification.action ? 10000 : 6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ mb: 2, mr: 2 }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.severity}
              variant="filled"
              sx={{ width: '100%' }}
              action={
                notification.action ? (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleGotoDashboard}
                  >
                    انتقل إلى لوحة التحكم
                  </Button>
                ) : undefined
              }
            >
              {notification.message}
            </Alert>
          </Snackbar>
          
          {/* زر إضافي مباشر للوحة التحكم للتطوير (يظهر فقط إذا كان المستخدم مسجل الدخول ولم يكن في صفحة لوحة التحكم) */}
          {isAuthenticated && !isAdminRoute && (
            <div style={{ 
              position: 'fixed', 
              bottom: 20, 
              left: 20, 
              zIndex: 9999 
            }}>
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="contained"
                color="secondary"
                sx={{ 
                  borderRadius: '50%', 
                  minWidth: 56,
                  height: 56,
                  boxShadow: 3,
                  fontSize: '1.25rem'
                }}
                aria-label="انتقل للوحة التحكم"
              >
                👨‍💼
              </Button>
            </div>
          )}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;