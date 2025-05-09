// src/features/services/components/ImageUploader.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import professionalService from '../services/professionalService';

const ImageUploader = ({ images = [], onChange, limit = 5, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('يرجى اختيار ملف صورة بتنسيق JPEG أو PNG');
      return;
    }
    
    // التحقق من حجم الملف (أقل من 5 ميغابايت)
    if (file.size > 5 * 1024 * 1024) {
      setError('يجب أن يكون حجم الصورة أقل من 5 ميغابايت');
      return;
    }
    
    // التحقق من عدد الصور
    if (images.length >= limit) {
      setError(`لا يمكن رفع أكثر من ${limit} صور`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // رفع الصورة
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await professionalService.uploadServiceImage(formData);
      
      // إضافة الصورة الجديدة للقائمة
      const newImages = [...images, response.data.imageUrl];
      onChange(newImages);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setLoading(false);
      // إعادة تعيين قيمة الإدخال
      event.target.value = null;
    }
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* الصور المرفوعة */}
        {images.map((image, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={image}
                alt={`صورة ${index + 1}`}
                sx={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
              {!disabled && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    }
                  }}
                  size="small"
                  onClick={() => handleRemove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Grid>
        ))}
        
        {/* زر إضافة صورة */}
        {images.length < limit && !disabled && (
          <Grid item xs={6} sm={4} md={3}>
            <Box
              sx={{
                width: '100%',
                height: 150,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              component="label"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                hidden
                onChange={handleUpload}
                disabled={loading || disabled}
              />
              {loading ? (
                <CircularProgress size={30} />
              ) : (
                <>
                  <AddIcon fontSize="large" color="primary" />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    إضافة صورة
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
           <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        * يمكنك رفع {limit} صور كحد أقصى
        <br />
        * يجب أن تكون الصور بتنسيق JPEG أو PNG وحجم أقل من 5 ميغابايت
        <br />
        * الصورة الأولى ستكون هي الصورة الرئيسية للخدمة
      </Typography>
    </Box>
  );
};

export default ImageUploader;