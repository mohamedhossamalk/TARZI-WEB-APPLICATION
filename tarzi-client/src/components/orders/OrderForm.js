import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import { createOrder } from '../../store/actions/orderActions';
import { getUserMeasurements } from '../../store/actions/measurementActions';
import { clearCart } from '../../store/actions/cartActions';

const OrderForm = ({ cartItems, shippingAddress, totalAmount }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { measurements, loading: measurementsLoading } = useSelector(state => state.measurements);
  const { loading, error, success } = useSelector(state => state.orders);
  
  const [orderData, setOrderData] = useState({
    paymentMethod: 'cashOnDelivery',
    measurementId: '',
    additionalRequests: '',
    useNewAddress: false,
    address: '',
    city: '',
    postalCode: '',
    country: 'مصر'
  });
  
  // Load user measurements
  useEffect(() => {
    dispatch(getUserMeasurements());
  }, [dispatch]);
  
  // Handle redirect after successful order creation
  useEffect(() => {
    if (success) {
      dispatch(clearCart());
      navigate('/order-success');
    }
  }, [success, navigate, dispatch]);
  
  // Update address fields if shipping address changes
  useEffect(() => {
    if (shippingAddress && !orderData.useNewAddress) {
      setOrderData(prev => ({
        ...prev,
        address: shippingAddress.address || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'مصر'
      }));
    }
  }, [shippingAddress, orderData.useNewAddress]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setOrderData({ ...orderData, [name]: checked });
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { useNewAddress, ...orderDataToSubmit } = orderData;
    
    // Create shipping address object
    const shippingAddressToUse = useNewAddress
      ? {
          address: orderData.address,
          city: orderData.city,
          postalCode: orderData.postalCode,
          country: orderData.country
        }
      : shippingAddress;
    
    // Prepare order data
    const order = {
      orderItems: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        fabricChoice: item.fabricChoice,
        colorChoice: item.colorChoice
      })),
      shippingAddress: shippingAddressToUse,
      paymentMethod: orderData.paymentMethod,
      measurementId: orderData.measurementId || undefined,
      additionalRequests: orderData.additionalRequests,
      itemsPrice: totalAmount.subtotal,
      taxPrice: totalAmount.tax,
      shippingPrice: totalAmount.shipping,
      totalPrice: totalAmount.total
    };
    
    dispatch(createOrder(order));
  };
  
  return (
    <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {t('order.placeOrder')}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Payment Method */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('checkout.paymentMethod')}
          </Typography>
          
          <TextField
            select
            fullWidth
            name="paymentMethod"
            value={orderData.paymentMethod}
            onChange={handleChange}
          >
            <MenuItem value="cashOnDelivery">{t('checkout.cashOnDelivery')}</MenuItem>
            <MenuItem value="creditCard" disabled>{t('checkout.creditCard')}</MenuItem>
          </TextField>
        </Grid>
        
        {/* Measurements */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('checkout.measurements')}
          </Typography>
          
          {measurementsLoading ? (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          ) : (
            <TextField
              select
              fullWidth
              name="measurementId"
              value={orderData.measurementId}
              onChange={handleChange}
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
          )}
        </Grid>
        
        {/* Additional Requests */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('order.additionalRequests')}
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            name="additionalRequests"
            value={orderData.additionalRequests}
            onChange={handleChange}
            placeholder={t('order.additionalRequestsPlaceholder')}
          />
        </Grid>
        
        {/* Shipping Address */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('order.shippingAddress')}
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={orderData.useNewAddress}
                onChange={handleChange}
                name="useNewAddress"
              />
            }
            label={t('checkout.useNewAddress')}
          />
          
          {(orderData.useNewAddress || !shippingAddress) && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label={t('profile.address')}
                  value={orderData.address}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="city"
                  label={t('profile.city')}
                  value={orderData.city}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="postalCode"
                  label={t('profile.zip')}
                  value={orderData.postalCode}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="country"
                  label={t('profile.country')}
                  value={orderData.country}
                  onChange={handleChange}
                >
                  <MenuItem value="مصر">مصر</MenuItem>
                  <MenuItem value="السعودية">السعودية</MenuItem>
                  <MenuItem value="الإمارات">الإمارات</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              t('order.placeOrder')
            )}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderForm;