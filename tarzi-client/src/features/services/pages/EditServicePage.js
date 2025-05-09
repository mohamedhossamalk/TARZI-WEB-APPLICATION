// src/features/services/pages/EditServicePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../core/hooks/useAuth';
import professionalService from '../services/professionalService';
import ImageUploader from '../components/ImageUploader';

const EditServicePage = () => {
  const { id } = useParams();
  const { isAuthenticated, isProfessional, user } = useAuth();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState(['']);

  useEffect(() => {
    // التحقق من صلاحيات المستخدم
    if (!isAuthenticated || !isProfessional) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب تفاصيل الخدمة
        const serviceResponse = await professionalService.getServiceById(id);
        const serviceData = serviceResponse.data.service;
        
        // التحقق مما إذا كان المستخدم هو صاحب الخدمة
        if (serviceData.professional._id !== user._id) {
          navigate('/services/manage');
          return;
        }
        
        setService(serviceData);
        
        // تعيين الميزات
        if (serviceData.features && serviceData.features.length > 0) {
          setFeatures(serviceData.features);
        }
        
        // جلب الفئات
        const categoriesResponse = await professionalService.getServiceCategories();
        setCategories(categoriesResponse.data.categories);
        
        // تعيين القيم الأولية للنموذج
        formik.setValues({
          title: serviceData.title || '',
          description: serviceData.description || '',
          categoryId: serviceData.categoryId || '',
          price: serviceData.price || '',
          deliveryTime: serviceData.deliveryTime || '',
          images: serviceData.images || [],
          isActive: serviceData.isActive !== undefined ? serviceData.isActive : true
        });
        
      } catch (err) {
        console.error('Error fetching service data:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب بيانات الخدمة');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isAuthenticated, isProfessional, navigate, user]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('عنوان الخدمة مطلوب')
      .min(5, 'يجب أن يكون العنوان على الأقل 5 أحرف')
      .max(100, 'يجب ألا يتجاوز العنوان 100 حرف'),
    description: Yup.string()
      .required('وصف الخدمة مطلوب')
      .min(20, 'يجب أن يكون الوصف على الأقل 20 حرف')
      .max(2000, 'يجب ألا يتجاوز الوصف 2000 حرف'),
    categoryId: Yup.string()
      .required('يرجى اختيار فئة الخدمة'),
    price: Yup.number()
      .required('سعر الخدمة مطلوب')
      .positive('يجب أن يكون السعر قيمة موجبة')
      .min(1, 'يجب أن يكون السعر على الأقل 1 ريال'),
    deliveryTime: Yup.number()
      .required('مدة التنفيذ مطلوبة')
      .positive('يجب أن تكون مدة التنفيذ قيمة موجبة')
      .integer('يجب أن تكون مدة التنفيذ رقمًا صحيحًا')
      .min(1, 'يجب أن تكون مدة التنفيذ يوم واحد على الأقل'),
    images: Yup.array()
      .min(1, 'يرجى إضافة صورة واحدة على الأقل')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      categoryId: '',
      price: '',
      deliveryTime: '',
      images: [],
      isActive: true
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError(null);
        
        // إعداد الميزات (مع إزالة الميزات الفارغة)
        const validFeatures = features.filter(feature => feature.trim() !== '');
        
        // إرسال التحديثات للخادم
        await professionalService.updateService(id, {
          ...values,
          features: validFeatures
        });
        
        // العودة إلى صفحة تفاصيل الخدمة
        navigate(`/services/${id}`);
      } catch (err) {
        console.error('Error updating service:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الخدمة');
        setSubmitting(false);
        
        // التمرير للأعلى لعرض الخطأ
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // إضافة ميزة جديدة
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  // تحديث قيمة ميزة
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  // حذف ميزة
  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  // تحديث الصور المرفوعة
  const handleImagesChange = (imageUrls) => {
    formik.setFieldValue('images', imageUrls);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
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
          to="/services"
        >
          الخدمات المهنية
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/services/manage"
        >
          خدماتي
        </Link>
        <Typography color="text.primary">تعديل الخدمة</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        تعديل الخدمة
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              معلومات الخدمة الأساسية
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                  name="isActive"
                  color="primary"
                />
              }
              label={formik.values.isActive ? "الخدمة نشطة" : "الخدمة غير نشطة"}
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="عنوان الخدمة"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="وصف الخدمة"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}>
                <InputLabel id="category-label">فئة الخدمة</InputLabel>
                <Select
                  labelId="category-label"
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="فئة الخدمة"
                  disabled={submitting}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <FormHelperText>{formik.errors.categoryId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="سعر الخدمة"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                disabled={submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ر.س</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="deliveryTime"
                name="deliveryTime"
                label="مدة التنفيذ (بالأيام)"
                type="number"
                value={formik.values.deliveryTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.deliveryTime && Boolean(formik.errors.deliveryTime)}
                helperText={formik.touched.deliveryTime && formik.errors.deliveryTime}
                disabled={submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">يوم</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            ميزات الخدمة
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            أضف ميزات الخدمة التي تقدمها (مثال: تصميم مجاني، توصيل مجاني، إلخ)
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label={`الميزة ${index + 1}`}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                disabled={submitting}
              />
              
              <IconButton 
                onClick={() => handleRemoveFeature(index)}
                disabled={features.length === 1 || submitting}
                color="error"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddFeature}
            disabled={submitting}
          >
            إضافة ميزة أخرى
          </Button>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            صور الخدمة
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            قم بتحميل صور توضح الخدمة أو نماذج من أعمالك السابقة
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <ImageUploader
            images={formik.values.images}
            onChange={handleImagesChange}
            limit={5}
            disabled={submitting}
          />
          
          {formik.touched.images && formik.errors.images && (
            <FormHelperText error>{formik.errors.images}</FormHelperText>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/services/manage"
            variant="outlined"
            disabled={submitting}
          >
            إلغاء
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditServicePage;