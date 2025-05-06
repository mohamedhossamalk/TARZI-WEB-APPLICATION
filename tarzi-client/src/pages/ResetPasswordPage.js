// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Alert, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../services/AuthService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // التحقق من صلاحية التوكن
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenError(true);
        return;
      }

      // يمكننا هنا إضافة تحقق من صلاحية التوكن من الخادم إذا كان الـ API يدعم ذلك
      // مثال:
      // try {
      //   await AuthService.verifyResetToken(token);
      // } catch (err) {
      //   setTokenError(true);
      //   setError('رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية');
      // }
    };

    verifyToken();
  }, [token]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من كلمة المرور
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await AuthService.resetPassword({
        token,
        password,
        confirmPassword
      });
      
      setSuccess(true);
      setLoading(false);
      
      // توجيه المستخدم إلى صفحة تسجيل الدخول بعد 3 ثوان
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setLoading(false);
      console.error('Error resetting password:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى');
      }
    }
  };

  if (tokenError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            خطأ في رابط استعادة كلمة المرور
          </Typography>
          <Alert severity="error" sx={{ my: 3 }}>
            رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.
          </Alert>
          <Box textAlign="center" mt={2}>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                طلب رابط جديد
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          إعادة تعيين كلمة المرور
        </Typography>
        
        {success ? (
          <Box textAlign="center" mt={3}>
            <Alert severity="success" sx={{ mb: 3 }}>
              تم إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
            </Alert>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                تسجيل الدخول
              </Button>
            </Link>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} mt={3}>
            <Typography variant="body1" gutterBottom>
              أدخل كلمة المرور الجديدة لحسابك.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              margin="normal"
              label="كلمة المرور الجديدة"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2, mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePasswordToggle} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="تأكيد كلمة المرور الجديدة"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleConfirmPasswordToggle} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'جار المعالجة...' : 'إعادة تعيين كلمة المرور'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;