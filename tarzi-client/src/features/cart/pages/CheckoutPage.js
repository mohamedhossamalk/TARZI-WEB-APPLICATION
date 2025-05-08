// src/features/cart/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';
import { useAuth } from '../../../core/hooks/useAuth';
import AddressForm from '../components/AddressForm';
import PaymentForm from '../components/PaymentForm';
import OrderSummary from '../components/OrderSummary';
import OrderSuccess from '../components/OrderSuccess';
import cartService from '../services/cartService';

const steps = ['سلة التسوق', 'معلومات التوصيل', 'الدفع', 'تأكيد الطلب'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // التحقق من وجود منتجات في السلة
  useEffect(() => {
    if (!cart || cart.items?.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    handleNext();
  };

  const handlePaymentSubmit = (method) => {
    setPaymentMethod(method);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // تجهيز بيانات الطلب
      const orderData = {
        shippingAddress,
        paymentMethod,
        items: cart.items,
        subtotal: cart.subtotal,
        shippingCost: cart.shippingCost,
        taxAmount: cart.taxAmount,
        discount: cart.discount,
        totalPrice: cart.totalPrice
      };

      // محاكاة طلب API لإنشاء الطلب
      setTimeout(() => {
        // إنشاء رقم طلب افتراضي
        const mockOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        setOrderNumber(mockOrderNumber);
        setOrderSuccess(true);
        clearCart(); // مسح السلة بعد نجاح الطلب
        handleNext(); // الانتقال للخطوة النهائية
        setLoading(false);
      }, 1500);

      // في التطبيق الحقيقي، استخدم التعليق أدناه بدلاً من setTimeout أعلاه
      /*
      const response = await cartService.placeOrder(orderData);
      setOrderNumber(response.data.orderNumber);
      setOrderSuccess(true);
      clearCart();
      handleNext();
      */

    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm 
          onSubmit={handleAddressSubmit} 
          onCancel={() => navigate('/cart')} 
          initialData={user?.addresses?.[0] || {}}
        />;
      case 1:
        return <PaymentForm 
          onSubmit={handlePaymentSubmit} 
          onBack={handleBack} 
        />;
      case 2:
        return <OrderSummary 
          onPlaceOrder={handlePlaceOrder} 
          onBack={handleBack} 
          loading={loading} 
          error={error} 
          shippingAddress={shippingAddress} 
          paymentMethod={paymentMethod} 
        />;
      case 3:
        return <OrderSuccess orderNumber={orderNumber} />;
      default:
        throw new Error('خطوة غير معروفة');
    }
  };

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
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/cart"
        >
          سلة التسوق
        </Link>
        <Typography color="text.primary">إتمام الشراء</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        إتمام الشراء
      </Typography>

      {/* خطوات إتمام الطلب */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            // لا تظهر الخطوة الأخيرة إلا بعد نجاح الطلب
            if (index === 3 && !orderSuccess) return null;
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {getStepContent(activeStep)}
          </Paper>
        </Grid>
        
        {activeStep < 3 && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ملخص الطلب
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {cart && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      عدد المنتجات: {cart.items?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      المجموع: {cart.subtotal} ر.س
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      الشحن: {cart.shippingCost} ر.س
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      الضريبة: {cart.taxAmount} ر.س
                    </Typography>
                    {cart.discount > 0 && (
                      <Typography variant="body2" color="error">
                        الخصم: -{cart.discount} ر.س
                      </Typography>
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      الإجمالي:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {cart.totalPrice} ر.س
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {activeStep >= 1 && shippingAddress && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShippingIcon fontSize="small" sx={{ mr: 0.5 }} /> عنوان التوصيل
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.fullName}
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.city}، {shippingAddress.state}
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.country}، {shippingAddress.postalCode}
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.phoneNumber}
                  </Typography>
                </Box>
              )}
              
              {activeStep >= 2 && paymentMethod && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon fontSize="small" sx={{ mr: 0.5 }} /> طريقة الدفع
                  </Typography>
                  <Typography variant="body2">
                    {paymentMethod === 'cod' ? 'الدفع عند التسليم' : 'بطاقة ائتمانية'}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/cart"
                  startIcon={<ShoppingBagIcon />}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 1 }}
                >
                  العودة إلى السلة
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default CheckoutPage;