// src/features/services/components/ServiceCard.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Rating,
  Button
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const ServiceCard = ({ service }) => {
  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={service.images?.[0] || '/assets/images/service-placeholder.jpg'}
        alt={service.title}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '48px'
        }}>
          {service.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {service.professional?.name || 'مزود الخدمة'}
          </Typography>
        </Box>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '40px'
          }}
        >
          {service.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {service.deliveryTime} {service.deliveryTime > 10 ? 'يوم' : 'أيام'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={service.rating || 0} readOnly size="small" /> 
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({service.reviewsCount || 0})
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" color="primary.main">
          {service.price} ر.س
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/services/${service._id}`}
          variant="contained"
          color="primary"
          fullWidth
        >
          عرض التفاصيل
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;