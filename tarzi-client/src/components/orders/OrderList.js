import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ShoppingBag as OrderIcon,
} from '@mui/icons-material';
import OrderItem from './OrderItem';
import { getStatusColor } from '../../utils/helpers';

const OrderList = ({ orders, loading, error }) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <OrderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('order.noOrders')}
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {t('order.shopNow')}
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </Box>
  );
};

export default OrderList;