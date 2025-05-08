// src/features/cart/components/CartItemList.js
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';
import { Link as RouterLink } from 'react-router-dom';
import CartItemSkeleton from './CartItemSkeleton';

const CartItemList = () => {
  const { cart, updateItemQuantity, removeItem, loading, error } = useCart();
  
  if (loading) {
    return (
      <Box>
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
        السلة فارغة
      </Typography>
    );
  }
  
  const handleQuantityChange = (itemId, value) => {
    // تحويل القيمة إلى رقم والتحقق من أنها أكبر من صفر
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateItemQuantity(itemId, quantity);
    }
  };
  
  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        المنتجات ({cart.items.length})
      </Typography>
      
      {cart.items.map((item) => (
        <Box key={item._id} sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Box
                component={RouterLink}
                to={`/products/${item.productId}`}
                sx={{ display: 'block', textDecoration: 'none' }}
              >
                <Box
                  component="img"
                  src={item.image || '/assets/images/placeholder.png'}
                  alt={item.name}
                  sx={{ 
                    width: '100%', 
                    height: 120, 
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <Box
                component={RouterLink}
                to={`/products/${item.productId}`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.name}
                </Typography>
              </Box>
              
              {item.fabricChoice && (
                <Typography variant="body2" color="text.secondary">
                  القماش: {item.fabricChoice}
                </Typography>
              )}
              
              {item.colorChoice && (
                <Typography variant="body2" color="text.secondary">
                  اللون: {item.colorChoice}
                </Typography>
              )}
              
              {item.measurementId && (
                <Typography variant="body2" color="text.secondary">
                  المقاس: {item.measurementName || 'مقاس مخصص'}
                </Typography>
              )}
              
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {item.price} ر.س
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'start', sm: 'center' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 120 }}>
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                
                <TextField
                  size="small"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  inputProps={{ 
                    min: 1,
                    style: { textAlign: 'center', width: 40, padding: '4px' }
                  }}
                  sx={{ mx: 1 }}
                />
                
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'start', sm: 'end' } }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {(item.price * item.quantity).toFixed(2)} ر.س
              </Typography>
              
              <IconButton
                color="error"
                size="small"
                onClick={() => handleRemoveItem(item._id)}
                aria-label="حذف من السلة"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default CartItemList;