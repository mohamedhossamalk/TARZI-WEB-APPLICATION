import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  KeyboardReturn as ReturnIcon
} from '@mui/icons-material';
import CartItem from '../components/cart/CartItem';

const CartPage = () => {
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('cart.title')} {items.length > 0 && `(${items.length})`}
      </Typography>
      
      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('cart.empty')}
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            color="primary"
            startIcon={<ReturnIcon />}
            sx={{ mt: 2 }}
          >
            {t('cart.continueShopping')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Box>
              {items.map((item) => (
                <CartItem key={`${item._id}-${item.fabricChoice}-${item.colorChoice}`} item={item} />
              ))}
            </Box>
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('cart.summary')}
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">
                  {t('cart.subtotal')}:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {calculateTotal().toLocaleString()} {t('common.currency')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">
                  {t('cart.shipping')}:
                </Typography>
                <Typography variant="body1">
                  0 {t('common.currency')}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {t('cart.total')}:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {calculateTotal().toLocaleString()} {t('common.currency')}
                </Typography>
              </Box>
              
              <Button
                component={RouterLink}
                to={isAuthenticated ? "/checkout" : "/login?redirect=checkout"}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                {t('cart.checkout')}
              </Button>
              
              <Button
                component={RouterLink}
                to="/products"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t('cart.continueShopping')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;