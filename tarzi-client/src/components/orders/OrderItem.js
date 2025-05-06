import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Divider
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const OrderItem = ({ order }) => {
  const { t } = useTranslation();
  
  const {
    _id,
    orderNumber,
    status,
    createdAt,
    productId,
    totalPrice,
    items = []
  } = order;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <OrderIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            {t('order.orderNumber')}: {orderNumber}
          </Typography>
        </Box>
        
        <Chip
          label={t(`order.${status}`)}
          color={getStatusColor(status)}
          size="small"
        />
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            {t('order.date')}
          </Typography>
          <Typography variant="body1">
            {formattedDate}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            {t('cart.total')}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalPrice?.toLocaleString()} {t('common.currency')}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            {t('product.items')}
          </Typography>
          <Typography variant="body1">
            {items.length || 1} {t('product.item', { count: items.length || 1 })}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'flex-end' }}>
          <Button
            component={RouterLink}
            to={`/orders/${_id}`}
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
          >
            {t('order.viewDetails')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderItem;