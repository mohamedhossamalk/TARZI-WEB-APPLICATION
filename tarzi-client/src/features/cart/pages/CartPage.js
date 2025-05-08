// src/features/cart/pages/CartPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingBag,
  ShoppingCart,
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';
import CartItem from '../components/CartItem';
import { useMeasurements } from '../../../core/hooks/useMeasurements';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { measurements, isLoading: measurementsLoading } = useMeasurements();
  
  const [openClearDialog, setOpenClearDialog] = useState(false);
  
  // تنسيق السعر
  const formatPrice = (price) => {
    return price.toLocaleString('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    });
  };

  // حساب الضريبة (14%)
  const tax = subtotal * 0.14;
  
  // رسوم التوصيل (ثابتة 50 جنيه)
  const shipping = 50;
  
  // المجموع الكلي
  const total = subtotal + tax + shipping;
  
  // فتح حوار تفريغ السلة
  const handleOpenClearDialog = () => {
    setOpenClearDialog(true);
  };
  
  // إغلاق حوار تفريغ السلة
  const handleCloseClearDialog = () => {
    setOpenClearDialog(false);
  };
  
  // تفريغ السلة
  const handleClearCart = () => {
    clearCart();
    setOpenClearDialog(false);
  };
  
  // المتابعة للدفع
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };
  
  // مواصلة التسوق
  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        سلة التسوق
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, mt: 2, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            سلة التسوق فارغة
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            لم تقم بإضافة أي منتجات إلى سلة التسوق حتى الآن.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingBag />}
            onClick={handleContinueShopping}
            sx={{ mt: 2 }}
          >
            تصفح المنتجات
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* قائمة المنتجات في السلة */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              {cartItems.map((item, index) => (
                <React.Fragment key={`${item.productId}-${index}`}>
                  <CartItem
                    item={item}
                    index={index}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    measurements={measurements}
                  />
                  {index < cartItems.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              ))}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleOpenClearDialog}
                >
                  تفريغ السلة
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleContinueShopping}
                >
                  مواصلة التسوق
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* ملخص السلة */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                ملخص الطلب
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">المجموع الفرعي:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(subtotal)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">الضريبة (14%):</Typography>
                  <Typography variant="body1">{formatPrice(tax)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">رسوم التوصيل:</Typography>
                  <Typography variant="body1">{formatPrice(shipping)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">الإجمالي:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {formatPrice(total)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                {/* التحقق من وجود مقاسات */}
                {cartItems.some(item => !item.measurementId) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    بعض المنتجات بدون مقاس. يرجى اختيار المقاسات لجميع المنتجات قبل المتابعة.
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.some(item => !item.measurementId)}
                >
                  متابعة الدفع
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* حوار تفريغ السلة */}
      <Dialog
        open={openClearDialog}
        onClose={handleCloseClearDialog}
      >
        <DialogTitle>تفريغ سلة التسوق</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من أنك تريد تفريغ سلة التسوق؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearDialog} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleClearCart} color="error" autoFocus>
            تفريغ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;