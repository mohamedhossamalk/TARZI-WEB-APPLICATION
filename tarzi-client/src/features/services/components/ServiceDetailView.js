// src/features/services/components/ServiceDetailView.js
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  Rating
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  CategoryOutlined as CategoryIcon
} from '@mui/icons-material';

const ServiceDetailView = ({ service }) => {
  return (
    <Paper sx={{ p: 3, mb: 4, overflow: 'hidden' }}>
      <Grid container spacing={3}>
        {/* صورة الخدمة الرئيسية */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={service.images?.[0] || '/assets/images/service-placeholder.jpg'}
            alt={service.title}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          
          {/* صور إضافية (إذا وجدت) */}
          {service.images && service.images.length > 1 && (
            <Box sx={{ display: 'flex', mt: 2, gap: 1, overflowX: 'auto' }}>
              {service.images.slice(1).map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${service.title} image ${index + 2}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>
        
        {/* معلومات الخدمة */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={service.category?.name || 'خدمة مهنية'} 
                color="primary" 
                size="small"
                icon={<CategoryIcon />}
              />
            </Box>
            
            <Typography variant="h4" component="h1" gutterBottom>
              {service.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={service.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({service.reviewsCount || 0} تقييم)
              </Typography>
            </Box>
            
            <Typography variant="h5" color="primary.main" sx={{ mb: 3 }}>
              {service.price} ر.س
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTimeIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                مدة التنفيذ: <strong>{service.deliveryTime}</strong> {service.deliveryTime > 10 ? 'يوم' : 'أيام'}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              {service.shortDescription || service.description?.substring(0, 150) + (service.description?.length > 150 ? '...' : '')}
            </Typography>
            
            {/* ميزات مختصرة */}
            {service.features && service.features.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  تتضمن الخدمة:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {service.features.slice(0, 3).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                  {service.features.length > 3 && (
                    <Chip
                      label={`+${service.features.length - 3} أخرى`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ServiceDetailView;