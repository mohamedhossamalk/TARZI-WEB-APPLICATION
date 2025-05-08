// src/features/profile/components/ProfileImageUpload.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AddAPhoto as AddPhotoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import profileService from '../services/profileService';

const ProfileImageUpload = ({ currentImage, onImageChange, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
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

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // محاولة رفع الصورة
      const response = await profileService.uploadProfileImage(formData);
      
      // إرسال رابط الصورة الجديدة للمكون الأب
      if (onImageChange) {
        onImageChange(response.data.imageUrl);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setLoading(false);
      // إعادة تعيين قيمة الإدخال للسماح برفع نفس الملف مرة أخرى إذا لزم الأمر
      e.target.value = null;
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    if (onImageChange) {
      onImageChange('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={currentImage || '/assets/images/avatar-placeholder.png'}
          alt="صورة الملف الشخصي"
          sx={{
            width: 150,
            height: 150,
            cursor: disabled ? 'default' : 'pointer',
            transition: 'opacity 0.3s',
            '&:hover': {
              opacity: disabled ? 1 : 0.8,
            },
            border: '4px solid',
            borderColor: 'primary.light',
          }}
          onClick={handleClick}
        />
        
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '50%'
            }}
          >
            <CircularProgress size={40} color="primary" />
          </Box>
        ) : (
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={handleClick}
            disabled={disabled || loading}
          >
            <AddPhotoIcon />
          </IconButton>
        )}
        
        {currentImage && !loading && (
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 5,
              left: 5,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
            onClick={handleRemoveImage}
            disabled={disabled || loading}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        انقر لتحميل صورة جديدة
        <br />
        (JPEG أو PNG، أقل من 5 ميغابايت)
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ProfileImageUpload;