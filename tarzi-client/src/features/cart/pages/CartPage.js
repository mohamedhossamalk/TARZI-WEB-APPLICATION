// src/features/cart/pages/CartPage.js
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  ShoppingCartCheckout as CheckoutIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';
import CartItemList from '../components/CartItemList';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';

const steps = ['سلة التسوق', 'الدفع', 'تأكيد الطلب'];

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, error } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>جاري تحميل سلة التسوق...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  const isEmpty = !cart || cart.items?.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* شريط التنقل */}
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Typography color="text.primary">سلة التسوق</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <ShoppingBagIcon sx={{ mr: 1 }} />
        سلة التسوق
      </Typography>

      {/* خطوات إتمام الطلب */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {isEmpty ? (
        <EmptyCart onContinueShopping={handleContinueShopping} />
      ) : (
        <Grid container spacing={4}>
          {/* قائمة المنتجات في السلة */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, mb: { xs: 3, lg: 0 } }}>
              <CartItemList />
            </Paper>
          </Grid>

          {/* ملخص السلة والسعر */}
          <Grid item xs={12} lg={4}>
            <CartSummary onCheckout={handleCheckout} />
            
            <Button
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={handleContinueShopping}
              sx={{ mt: 2 }}
            >
              متابعة التسوق
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;