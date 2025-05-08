// src/features/admin/components/categories/CategoryFormAdmin.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import adminService from '../../services/adminService';

const CategoryFormAdmin = ({ category, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(category?.image || '');
  const [imageFile, setImageFile] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required('اسم الفئة مطلوب'),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      isActive: category?.isActive !== undefined ? category.isActive : true
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        // تحميل الصورة إذا تم اختيارها
        let uploadedImageUrl = imageUrl;
        
        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          
          const response = await adminService.uploadCategoryImage(formData);
          uploadedImageUrl = response.data.imageUrl;
        }
        
        // تجهيز بيانات الفئة
        const categoryData = {
          ...values,
          image: uploadedImageUrl
        };
        
        await onSave(categoryData);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الفئة');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }
    
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <DialogTitle>
        {category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" noValidate onSubmit={formik.handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="اسم الفئة"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                id="description"
                name="description"
                label="وصف الفئة"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
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
                label="فئة نشطة"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                صورة الفئة
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                >
                  اختيار صورة
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                
                {imageUrl && (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="معاينة الصورة"
                    sx={{ width: 60, height: 60, ml: 2, borderRadius: 1 }}
                  />
                )}
              </Box>
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
          {loading ? <CircularProgress size={24} /> : (category ? 'حفظ التغييرات' : 'إضافة الفئة')}
        </Button>
      </DialogActions>
    </>
  );
};

export default CategoryFormAdmin;