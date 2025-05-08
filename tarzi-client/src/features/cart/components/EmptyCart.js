// src/features/cart/components/EmptyCart.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const EmptyCart = ({ onContinueShopping }) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <CartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
      
      <Typography variant="h5" gutterBottom>
        سلة التسوق فارغة
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.
        <br />
        اكتشف تشكيلتنا الواسعة من المنتجات وأضف ما يناسبك.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={onContinueShopping}
        size="large"
        sx={{ mt: 2 }}
      >
        متابعة التسوق
      </Button>
    </Paper>
  );
};

export default EmptyCart;