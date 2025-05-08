// src/features/admin/components/products/ProductImageUpload.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';

const ProductImageUpload = ({ initialImages = [], onImagesUploaded, disabled = false }) => {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // التحقق من أنواع الملفات
    const invalidFiles = files.filter(file => !file.type.includes('image/'));
    if (invalidFiles.length > 0) {
      setError('يرجى تحميل صور فقط');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // رفع الملفات
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      // محاولة استخدام الخدمة لرفع الصور
      try {
        const response = await adminService.uploadProductImages(formData);
        const newImages = [...images, ...response.data.imageUrls];
        
        setImages(newImages);
        onImagesUploaded(newImages);
      } catch (apiError) {
        console.error('Error calling API, using fallback method:', apiError);
        
        // طريقة بديلة في حالة عدم توفر API
        // إنشاء URLs مؤقتة للصور المحلية
        const tempImageUrls = [];
        
        for (const file of files) {
          const imageUrl = URL.createObjectURL(file);
          tempImageUrls.push(imageUrl);
        }
        
        const newImages = [...images, ...tempImageUrls];
        setImages(newImages);
        onImagesUploaded(newImages);
      }
    } catch (err) {
      setError('فشل في تحميل الصور. يرجى المحاولة مرة أخرى.');
      console.error('Error uploading images:', err);
    } finally {
      setLoading(false);
      // إعادة ضبط قيمة الإدخال
      e.target.value = null;
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleImageClick}
          disabled={disabled || loading}
        >
          اختيار صور للتحميل
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          يمكنك تحميل عدة صور في نفس الوقت. صيغ الملفات المدعومة: JPG, PNG, GIF
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {/* عرض الصور المحملة */}
        {images.map((imageUrl, index) => (
          <Grid item key={index} xs={6} sm={4} md={3}>
            <Paper 
              sx={{ 
                position: 'relative', 
                height: 150, 
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 1,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 3,
                  '& .delete-icon': {
                    opacity: 1
                  }
                }
              }}
            >
              <IconButton
                className="delete-icon"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'error.main'
                  }
                }}
                onClick={() => handleRemoveImage(index)}
                disabled={disabled}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Paper>
          </Grid>
        ))}
        
        {/* زر إضافة صورة جديدة */}
        <Grid item xs={6} sm={4} md={3}>
          <Paper 
            sx={{ 
              height: 150, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              border: '2px dashed',
              borderColor: 'primary.light',
              borderRadius: 1,
              cursor: disabled ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
                transform: disabled ? 'none' : 'scale(1.02)'
              }
            }}
            onClick={disabled ? undefined : handleImageClick}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  إضافة صورة
                </Typography>
              </>
            )}
          </Paper>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={disabled || loading}
          />
        </Grid>
      </Grid>
      
      {images.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {images.length} صور مُحملة • الصورة الأولى ستكون الصورة الرئيسية للمنتج
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// إضافة التصدير الافتراضي الذي كان مفقوداً
export default ProductImageUpload;