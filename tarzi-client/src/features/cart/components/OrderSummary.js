// src/features/cart/components/OrderSummary.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';

const OrderSummary = ({ onPlaceOrder, onBack, loading, error, shippingAddress, paymentMethod }) => {
  const { cart } = useCart();

  if (!cart) {
    return <Typography>لا توجد منتجات في السلة</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        تأكيد الطلب
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        <ShoppingBagIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        المنتجات
      </Typography>
      
      <List disablePadding>
        {cart.items.map((item) => (
          <ListItem key={item._id} sx={{ py: 1, px: 0 }}>
            <ListItemAvatar>
              <Avatar src={item.image} variant="square" sx={{ borderRadius: 1 }} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`${item.quantity} × ${item.price} ر.س`}
            />
            <Typography variant="body2">
              {(item.price * item.quantity).toFixed(2)} ر.س
            </Typography>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            <ShippingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            عنوان التوصيل
          </Typography>
          <Typography variant="body2">{shippingAddress.fullName}</Typography>
          <Typography variant="body2">{shippingAddress.street}</Typography>
          <Typography variant="body2">{`${shippingAddress.city}، ${shippingAddress.state}`}</Typography>
          <Typography variant="body2">{`${shippingAddress.country}، ${shippingAddress.postalCode}`}</Typography>
          <Typography variant="body2">{shippingAddress.phoneNumber}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            <PaymentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            طريقة الدفع
          </Typography>
          <Typography variant="body2">
            {paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            ملخص الطلب
          </Typography>
          <Box sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">المجموع الفرعي:</Typography>
              <Typography variant="body2">{cart.subtotal} ر.س</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">الشحن:</Typography>
              <Typography variant="body2">{cart.shippingCost} ر.س</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">الضريبة:</Typography>
              <Typography variant="body2">{cart.taxAmount} ر.س</Typography>
            </Box>
            {cart.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="error.main">الخصم:</Typography>
                <Typography variant="body2" color="error.main">-{cart.discount} ر.س</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>الإجمالي:</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="primary.main">
                {cart.totalPrice} ر.س
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack}>
          رجوع
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onPlaceOrder}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
        >
          {loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSummary;