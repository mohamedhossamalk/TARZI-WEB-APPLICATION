// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة البريد الإلكتروني
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await AuthService.forgotPassword(email);
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error in forgot password:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('حدث خطأ أثناء إرسال طلب استعادة كلمة المرور. يرجى المحاولة مرة أخرى');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          استعادة كلمة المرور
        </Typography>
        
        {success ? (
          <Box textAlign="center" mt={3}>
            <Alert severity="success" sx={{ mb: 3 }}>
              تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من البريد الوارد.
            </Alert>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                العودة لتسجيل الدخول
              </Button>
            </Link>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} mt={3}>
            <Typography variant="body1" gutterBottom>
              أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              margin="normal"
              label="البريد الإلكتروني"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3, mt: 2 }}
              InputProps={{ dir: 'ltr' }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'جار الإرسال...' : 'إرسال رابط استعادة كلمة المرور'}
            </Button>
            
            <Box mt={2} textAlign="center">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography color="primary">العودة إلى تسجيل الدخول</Typography>
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;