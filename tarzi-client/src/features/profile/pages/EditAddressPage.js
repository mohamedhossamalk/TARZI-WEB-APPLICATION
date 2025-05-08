// src/features/profile/pages/EditAddressPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  MenuItem
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import profileService from '../services/profileService';

const countries = [
  { value: 'SA', label: 'المملكة العربية السعودية' },
  { value: 'AE', label: 'الإمارات العربية المتحدة' },
  { value: 'BH', label: 'البحرين' },
  { value: 'KW', label: 'الكويت' },
  { value: 'OM', label: 'عمان' },
  { value: 'QA', label: 'قطر' },
  { value: 'EG', label: 'مصر' },
  { value: 'JO', label: 'الأردن' }
];

const EditAddressPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        
        const response = await profileService.getAddressById(id);
        setAddress(response.data.address);
        
        // تعيين القيم الأولية للنموذج
        if (response.data.address) {
          formik.setValues({
            name: response.data.address.name || '',
            phoneNumber: response.data.address.phoneNumber || '',
            street: response.data.address.street || '',
            city: response.data.address.city || '',
            state: response.data.address.state || '',
            country: response.data.address.country || 'SA',
            postalCode: response.data.address.postalCode || '',
            isDefault: response.data.address.isDefault || false
          });
        }
        
      } catch (err) {
        console.error('Error fetching address:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب العنوان');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchAddress();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required('يرجى إدخال الاسم'),
    phoneNumber: Yup.string().required('يرجى إدخال رقم الهاتف'),
    street: Yup.string().required('يرجى إدخال العنوان'),
    city: Yup.string().required('يرجى إدخال المدينة'),
    state: Yup.string().required('يرجى إدخال المنطقة'),
    country: Yup.string().required('يرجى اختيار الدولة'),
    postalCode: Yup.string().required('يرجى إدخال الرمز البريدي')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      country: 'SA',
      postalCode: '',
      isDefault: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        await profileService.updateAddress(id, values);
        navigate('/profile/addresses');
      } catch (err) {
        console.error('Error updating address:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث العنوان');
        setLoading(false);
      }
    }
  });

  if (fetchLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!address && !fetchLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          العنوان غير موجود أو تم حذفه.
          <Button
            component={RouterLink}
            to="/profile/addresses"
            sx={{ ml: 2 }}
            size="small"
          >
            العودة للعناوين
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/profile/addresses"
        >
          العناوين
        </Link>
        <Typography color="text.primary">تعديل العنوان</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1">
            تعديل العنوان
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="الاسم"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="street"
                name="street"
                label="العنوان التفصيلي"
                variant="outlined"
                multiline
                rows={2}
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.street && Boolean(formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="المدينة"
                variant="outlined"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="state"
                name="state"
                label="المنطقة"
                variant="outlined"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="country"
                name="country"
                label="الدولة"
                select
                variant="outlined"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
                disabled={loading}
              >
                {countries.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="postalCode"
                name="postalCode"
                label="الرمز البريدي"
                variant="outlined"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                helperText={formik.touched.postalCode && formik.errors.postalCode}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="isDefault"
                    name="isDefault"
                    checked={formik.values.isDefault}
                    onChange={formik.handleChange}
                    disabled={loading || address?.isDefault}
                  />
                }
                label="استخدام كعنوان افتراضي"
              />
              {address?.isDefault && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  هذا هو العنوان الافتراضي حالياً ولا يمكن تغيير هذا الإعداد.
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  component={RouterLink}
                  to="/profile/addresses"
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

export default EditAddressPage;