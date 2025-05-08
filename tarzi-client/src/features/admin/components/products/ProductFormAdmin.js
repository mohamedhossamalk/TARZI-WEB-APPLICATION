// src/features/admin/components/products/ProductFormAdmin.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  FormHelperText,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ProductImageUpload from './ProductImageUpload';
import adminService from '../../services/adminService';

const ProductFormAdmin = ({ product, onSave, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(product?.images || []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminService.getCategories();
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حدث خطأ أثناء جلب الفئات');
      }
    };
    
    fetchCategories();
    
    // تعيين الصور المحملة مسبقًا إذا كان المنتج موجودًا
    if (product?.images) {
      setUploadedImages(product.images);
    } else {
      setUploadedImages([]);
    }
  }, [product]);

  const validationSchema = Yup.object({
    name: Yup.string().required('اسم المنتج مطلوب'),
    price: Yup.number().required('السعر مطلوب').positive('يجب أن يكون السعر موجبًا'),
    category: Yup.string().required('الفئة مطلوبة'),
    description: Yup.string().required('وصف المنتج مطلوب'),
    quantity: Yup.number().required('الكمية مطلوبة').integer('يجب أن تكون الكمية عددًا صحيحًا').min(0, 'يجب أن تكون الكمية 0 على الأقل'),
    discount: Yup.number().min(0, 'يجب أن يكون الخصم 0 على الأقل').max(100, 'يجب أن يكون الخصم 100 على الأكثر'),
  });
  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      price: product?.price || '',
      category: product?.category?._id || '',
      description: product?.description || '',
      quantity: product?.quantity || 0,
      discount: product?.discount || 0,
      isActive: product?.isActive !== undefined ? product.isActive : true,
      specifications: product?.specifications || []
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        // تجهيز بيانات المنتج مع الصور
        const productData = {
          ...values,
          images: uploadedImages
        };
        
        await onSave(productData);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ المنتج');
      } finally {
        setLoading(false);
      }
    }
  });
  
  // معالجة تحميل الصور
  const handleImagesUploaded = (imageUrls) => {
    setUploadedImages(imageUrls);
  };
  
  return (
    <>
      <DialogTitle>
        {product ? 'تعديل منتج' : 'إضافة منتج جديد'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" noValidate onSubmit={formik.handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {/* البيانات الأساسية */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                البيانات الأساسية
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="اسم المنتج"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                <InputLabel id="category-label">الفئة</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="الفئة"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <FormHelperText>{formik.errors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="price"
                name="price"
                label="السعر (ج.م)"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                InputProps={{ inputProps: { step: '0.01', min: 0 } }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="quantity"
                name="quantity"
                label="الكمية"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                InputProps={{ inputProps: { min: 0 } }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="discount"
                name="discount"
                label="الخصم (%)"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                    name="isActive"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="منتج نشط (ظاهر للمستخدمين)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                name="description"
                label="وصف المنتج"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
              />
            </Grid>
            
            {/* صور المنتج */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" color="primary" gutterBottom>
                صور المنتج
              </Typography>
              <ProductImageUpload 
                initialImages={product?.images || []}
                onImagesUploaded={handleImagesUploaded}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (product ? 'حفظ التغييرات' : 'إضافة المنتج')}
        </Button>
      </DialogActions>
    </>
  );
  };
  
  export default ProductFormAdmin;