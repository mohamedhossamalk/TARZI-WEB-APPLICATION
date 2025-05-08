// src/features/cart/components/CartSummary.js
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCartCheckout as CheckoutIcon,
  LocalOffer as CouponIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';

const CartSummary = ({ onCheckout }) => {
  const { cart, applyCoupon, loading, error } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);
  
  if (!cart) return null;
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      setCouponLoading(true);
      setCouponError(null);
      setCouponSuccess(null);
      
      const result = await applyCoupon(couponCode);
      setCouponSuccess('تم تطبيق الكوبون بنجاح!');
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'حدث خطأ أثناء تطبيق الكوبون');
    } finally {
      setCouponLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        ملخص السلة
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">المجموع الفرعي:</Typography>
          <Typography variant="body1" fontWeight="medium">
            {cart.subtotal} ر.س
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">الشحن:</Typography>
          <Typography variant="body1">
            {cart.shippingCost > 0 ? `${cart.shippingCost} ر.س` : 'مجاني'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">الضريبة ({cart.taxRate || 15}%):</Typography>
          <Typography variant="body1">
            {cart.taxAmount} ر.س
          </Typography>
        </Box>
        
        {cart.discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="error.main">الخصم:</Typography>
            <Typography variant="body1" color="error.main">
              -{cart.discount} ر.س
            </Typography>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">الإجمالي:</Typography>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          {cart.totalPrice} ر.س
        </Typography>
      </Box>
      
      {/* كوبون الخصم */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          هل لديك كوبون خصم؟
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 1 }}>
          <TextField
            size="small"
            placeholder="أدخل رمز الكوبون"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CouponIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{ ml: 1 }}
          />
          <Button
            variant="outlined"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || couponLoading}
          >
            {couponLoading ? <CircularProgress size={24} /> : 'تطبيق'}
          </Button>
        </Box>
        
        {couponError && (
          <Alert severity="error" sx={{ mt: 1 }} onClose={() => setCouponError(null)}>
            {couponError}
          </Alert>
        )}
        
        {couponSuccess && (
          <Alert severity="success" sx={{ mt: 1 }} onClose={() => setCouponSuccess(null)}>
            {couponSuccess}
          </Alert>
        )}
      </Box>
      
      {/* زر الانتقال للدفع */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<CheckoutIcon />}
        onClick={onCheckout}
        disabled={loading || !cart.items || cart.items.length === 0}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'انتقل إلى الدفع'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default CartSummary;