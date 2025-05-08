// src/features/profile/pages/EditProfilePage.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../core/hooks/useAuth';
import ProfileImageUpload from '../components/ProfileImageUpload';
import profileService from '../services/profileService';

const EditProfilePage = () => {
  const { user, updateUserContext } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('يرجى إدخال الاسم'),
    email: Yup.string().email('البريد الإلكتروني غير صالح').required('يرجى إدخال البريد الإلكتروني'),
    username: Yup.string().required('يرجى إدخال اسم المستخدم'),
    phoneNumber: Yup.string().required('يرجى إدخال رقم الهاتف'),
    gender: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || 'male',
      avatar: user?.avatar || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await profileService.updateProfile(values);
        
        // تحديث معلومات المستخدم في سياق المصادقة
        if (updateUserContext) {
          updateUserContext(response.data.user);
        }
        
        setSuccess(true);
        
        // توجيه المستخدم إلى صفحة الملف الشخصي بعد ثانيتين
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        
      } catch (err) {
        console.error('Error updating profile:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleProfileImageChange = (imageUrl) => {
    formik.setFieldValue('avatar', imageUrl);
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
        <Typography color="text.primary">تعديل الملف الشخصي</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonIcon color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" component="h1">
            تعديل الملف الشخصي
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
            تم تحديث الملف الشخصي بنجاح! جاري التوجيه...
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ alignSelf: 'flex-start' }}>
                  الصورة الشخصية
                </Typography>
                <ProfileImageUpload 
                  currentImage={formik.values.avatar} 
                  onImageChange={handleProfileImageChange}
                  disabled={loading}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="الاسم الكامل"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="اسم المستخدم"
                    variant="outlined"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="البريد الإلكتروني"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="رقم الهاتف"
                    variant="outlined"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">الجنس</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="ذكر" disabled={loading} />
                      <FormControlLabel value="female" control={<Radio />} label="أنثى" disabled={loading} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
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
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;