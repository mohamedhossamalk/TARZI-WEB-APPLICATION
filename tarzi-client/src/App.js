import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Routes from './Routes';
import { checkAuthStatus } from './store/actions/authActions';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './assets/styles/App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { darkMode } = useSelector(state => state.theme || { darkMode: false });
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
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
          },
        },
      },
    },
  });
  
  // مراقبة حالة المصادقة في التطبيق
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      // ضمان وجود دور المسؤول
      if (user.role !== 'admin') {
        console.log('Fixing user role to admin...');
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
          message: 'تم تحديث دور المستخدم إلى مسؤول',
          severity: 'info'
        });
      }
    }
  }, [isAuthenticated, user, dispatch]);
  
  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
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
          role: 'admin', // التأكد من أن role هي 'admin' بالضبط
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
          
          // التأكد من وجود دور المسؤول
          if (parsedUser && parsedUser.role !== 'admin') {
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
              severity: 'info',
              action: () => {
                navigate('/admin/dashboard');
              }
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
        
        dispatch(checkAuthStatus());
      }
    } catch (error) {
      console.error('Error in auto login process:', error);
    }
  }, [dispatch, i18n.language, navigate]);
  
  // زر الانتقال مباشرة إلى لوحة التحكم للمساعدة في التطوير
  const handleGotoDashboard = () => {
    navigate('/admin/dashboard');
    handleCloseNotification();
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <CacheProvider value={i18n.language === 'ar' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes />
          </main>
          <Footer />
          
          {/* Notification */}
          <Snackbar 
            open={notification.open} 
            autoHideDuration={notification.action ? 60000 : 6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            action={
              notification.action ? (
                <Button 
                  color="secondary" 
                  size="small" 
                  onClick={handleGotoDashboard}
                >
                  انتقل إلى لوحة التحكم
                </Button>
              ) : null
            }
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.severity}
              action={
                notification.action ? (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleGotoDashboard}
                  >
                    انتقل إلى لوحة التحكم
                  </Button>
                ) : null
              }
            >
              {notification.message}
            </Alert>
          </Snackbar>
          
          {/* زر إضافي مباشر للوحة التحكم للتطوير (يظهر فقط إذا كان المستخدم مسجل الدخول) */}
          {isAuthenticated && (
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
                  boxShadow: 3
                }}
              >
                <span role="img" aria-label="Admin">👨‍💼</span>
              </Button>
            </div>
          )}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;