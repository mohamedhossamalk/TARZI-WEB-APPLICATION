import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  CheckCircle as ConfirmIcon
} from '@mui/icons-material';
import CartItem from '../components/cart/CartItem';
import { createOrder } from '../store/actions/orderActions';
import { clearCart } from '../store/actions/cartActions';
import { getUserMeasurements } from '../store/actions/measurementActions';

const steps = ['سلة التسوق', 'العنوان', 'الدفع', 'المراجعة والتأكيد'];

const CheckoutPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { measurements } = useSelector(state => state.measurements);
  const { loading, success, error } = useSelector(state => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'مصر'
  });
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [selectedMeasurement, setSelectedMeasurement] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  
  // Fetch user measurements
  useEffect(() => {
    dispatch(getUserMeasurements());
  }, [dispatch]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && activeStep !== 3) {
      navigate('/cart');
    }
  }, [items, navigate, activeStep]);
  
  // Redirect to order success page after order is created
  useEffect(() => {
    if (success && activeStep === 3) {
      navigate('/order-success');
      dispatch(clearCart());
    }
  }, [success, activeStep, navigate, dispatch]);
  
  // Calculate order summary
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shippingPrice = 50;
  const tax = subtotal * 0.14; // 14% VAT
  const total = subtotal + shippingPrice + tax;
  
  // Handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value
    });
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate cart not empty
      if (items.length === 0) {
        return;
      }
    } else if (activeStep === 1) {
      // Validate address
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
        // Show validation error
        return;
      }
    } else if (activeStep === 2) {
      // Validate payment method
      if (!paymentMethod) {
        return;
      }
    } else if (activeStep === 3) {
      // Place order
      handlePlaceOrder();
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    const orderData = {
      orderItems: items.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        fabricChoice: item.fabricChoice,
        colorChoice: item.colorChoice
      })),
      shippingAddress,
      paymentMethod,
      measurementId: selectedMeasurement || undefined,
      additionalRequests,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice,
      totalPrice: total
    };
    
    dispatch(createOrder(orderData));
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('checkout.title')}
        </Typography>
        
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{t(`checkout.step${index}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Cart Step */}
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('cart.title')}
                </Typography>
                
                <Paper sx={{ p: 2, mb: 2 }}>
                  {items.map(item => (
                    <CartItem key={`${item._id}-${item.fabricChoice}-${item.colorChoice}`} item={item} />
                  ))}
                </Paper>
              </>
            )}
            
            {/* Address Step */}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('checkout.shippingAddress')}
                </Typography>
                
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="address"
                        name="address"
                        label={t('profile.address')}
                        fullWidth
                        autoComplete="shipping address-line1"
                        value={shippingAddress.address}
                        onChange={handleAddressChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="city"
                        name="city"
                        label={t('profile.city')}
                        fullWidth
                        autoComplete="shipping address-level2"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="postalCode"
                        name="postalCode"
                        label={t('profile.zip')}
                        fullWidth
                        autoComplete="shipping postal-code"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="country"
                        name="country"
                        label={t('profile.country')}
                        fullWidth
                        autoComplete="shipping country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        select
                      >
                        <MenuItem value="مصر">مصر</MenuItem>
                        <MenuItem value="السعودية">السعودية</MenuItem>
                        <MenuItem value="الإمارات">الإمارات</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}
            
            {/* Payment Step */}
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('checkout.paymentMethod')}
                </Typography>
                
                <Paper sx={{ p: 3 }}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="payment-method"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                    >
                      <FormControlLabel
                        value="cashOnDelivery"
                        control={<Radio />}
                        label={t('checkout.cashOnDelivery')}
                      />
                      <FormControlLabel
                        value="creditCard"
                        control={<Radio />}
                        label={t('checkout.creditCard')}
                        disabled
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('checkout.measurements')}
                    </Typography>
                    
                    <TextField
                      id="measurement"
                      name="measurement"
                      label={t('checkout.selectMeasurement')}
                      fullWidth
                      select
                      value={selectedMeasurement}
                      onChange={(e) => setSelectedMeasurement(e.target.value)}
                      helperText={measurements?.length === 0 ? t('measurement.noMeasurements') : ''}
                    >
                      <MenuItem value="">
                        {t('checkout.noMeasurement')}
                      </MenuItem>
                      {measurements?.map((m) => (
                        <MenuItem key={m._id} value={m._id}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('order.additionalRequests')}
                    </Typography>
                    <TextField
                      id="additionalRequests"
                      name="additionalRequests"
                      label={t('order.additionalRequestsPlaceholder')}
                      fullWidth
                      multiline
                      rows={4}
                      value={additionalRequests}
                      onChange={(e) => setAdditionalRequests(e.target.value)}
                    />
                  </Box>
                </Paper>
              </>
            )}
            
            {/* Confirmation Step */}
            {activeStep === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('checkout.confirmOrder')}
                </Typography>
                
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('checkout.orderItems')}:
                  </Typography>
                  
                  {items.map(item => (
                    <Box 
                      key={`${item._id}-${item.fabricChoice}-${item.colorChoice}`} 
                      sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                    >
                      <Box
                        component="img"
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          mr: 2
                        }}
                        src={item.imageUrl || 'https://placehold.co/50x50?text=Tarzi'}
                        alt={item.name}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">
                          {item.name} ({item.quantity} x {item.price.toLocaleString()} {t('common.currency')})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('product.fabric')}: {item.fabricChoice}, {t('product.color')}: {item.colorChoice}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {(item.price * item.quantity).toLocaleString()} {t('common.currency')}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('checkout.shippingAddress')}:
                      </Typography>
                      
                      <Typography variant="body1">
                        {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('checkout.paymentMethod')}:
                      </Typography>
                      
                      <Typography variant="body1">
                        {paymentMethod === 'cashOnDelivery' 
                          ? t('checkout.cashOnDelivery') 
                          : t('checkout.creditCard')
                        }
                      </Typography>
                      
                      {selectedMeasurement && (
                        <>
                          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                            {t('checkout.selectedMeasurement')}:
                          </Typography>
                          
                          <Typography variant="body1">
                            {measurements?.find(m => m._id === selectedMeasurement)?.name || ''}
                          </Typography>
                        </>
                      )}
                      
                      {additionalRequests && (
                        <>
                          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                            {t('order.additionalRequests')}:
                          </Typography>
                          
                          <Typography variant="body1">
                            {additionalRequests}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                  </Alert>
                )}
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('cart.summary')}
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    {t('cart.subtotal')}:
                  </Typography>
                  <Typography variant="body1">
                    {subtotal.toLocaleString()} {t('common.currency')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    {t('cart.shipping')}:
                  </Typography>
                  <Typography variant="body1">
                    {shippingPrice.toLocaleString()} {t('common.currency')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    {t('cart.tax')}:
                  </Typography>
                  <Typography variant="body1">
                    {tax.toLocaleString()} {t('common.currency')}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  {t('cart.total')}:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {total.toLocaleString()} {t('common.currency')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    {t('common.back')}
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : activeStep === steps.length - 1 ? (
                    t('checkout.placeOrder')
                  ) : (
                    t('common.next')
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CheckoutPage;