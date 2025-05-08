// src/features/orders/components/OrderItemCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Paper,
  Tooltip,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { formatPrice } from '../../../core/utils/formatters';
import { useTranslation } from 'react-i18next';

const OrderItemCard = ({ item }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // التنقل إلى صفحة تفاصيل المنتج
  const handleViewProduct = () => {
    if (item.productId) {
      navigate(`/products/${item.productId}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* صورة المنتج */}
      <Box
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          flexShrink: 0,
          mr: 2,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
        }}
      >
        <Box
          component="img"
          src={item.imageUrl || '/assets/images/placeholder.png'}
          alt={item.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={handleViewProduct}
        />
      </Box>
      
      {/* تفاصيل المنتج */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              component="div"
              fontWeight="medium"
              sx={{ cursor: 'pointer' }}
              onClick={handleViewProduct}
            >
              {item.name}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {item.fabricChoice && (
                <Chip
                  label={`${t('products.fabric')}: ${item.fabricChoice}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              
              {item.colorChoice && (
                <Chip
                  label={`${t('products.color')}: ${item.colorChoice}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
              
              {item.measurementName && (
                <Chip
                  label={`${t('measurements.measurement')}: ${item.measurementName}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
          
          {/* السعر والكمية */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.price)} × {item.quantity}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </Box>
              
              <Tooltip title={t('general.viewDetails')}>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={handleViewProduct}
                >
                  {t('general.details')}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          
          {/* ملاحظات إضافية */}
          {item.additionalRequests && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t('orders.additionalRequests')}:</strong> {item.additionalRequests}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderItemCard;