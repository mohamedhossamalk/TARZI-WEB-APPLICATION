// src/features/profile/pages/ChangePasswordPage.js (تكملة)
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  VpnKey as KeyIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import profileService from '../services/profileService';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('يرجى إدخال كلمة المرور الحالية'),
    newPassword: Yup.string()
      .required('يرجى إدخال كلمة المرور الجديدة')
      .min(8, 'يجب أن تحتوي كلمة المرور على الأقل 8 أحرف')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 
        'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم ورمز خاص'
      ),
    confirmPassword: Yup.string()
      .required('يرجى تأكيد كلمة المرور الجديدة')
      .oneOf([Yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        await profileService.changePassword(values);
        
        setSuccess(true);
        formik.resetForm();
        
        // توجيه المستخدم إلى صفحة الملف الشخصي بعد ثانيتين
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        
      } catch (err) {
        console.error('Error changing password:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
      } finally {
        setLoading(false);
      }
    }
  });

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/profile"
        >
          الملف الشخصي
        </Link>
        <Typography color="text.primary">تغيير كلمة المرور</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <KeyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1">
            تغيير كلمة المرور
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            تم تغيير كلمة المرور بنجاح! جاري التوجيه...
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="currentPassword"
            name="currentPassword"
            label="كلمة المرور الحالية"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
            helperText={formik.touched.currentPassword && formik.errors.currentPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowCurrentPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            id="newPassword"
            name="newPassword"
            label="كلمة المرور الجديدة"
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowNewPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            id="confirmPassword"
            name="confirmPassword"
            label="تأكيد كلمة المرور الجديدة"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              يجب أن تحتوي كلمة المرور على الأقل 8 أحرف، وتتضمن حرفًا كبيرًا، وحرفًا صغيرًا، ورقمًا، ورمزًا خاصًا.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              component={RouterLink}
              to="/profile"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              disabled={loading}
            >
              إلغاء
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePasswordPage;