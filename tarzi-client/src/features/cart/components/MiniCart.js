// src/features/cart/components/MiniCart.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Popover
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';

const MiniCart = ({ anchorEl, open, onClose }) => {
  const { cart, removeItem } = useCart();
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center', width: 300 }}>
          <CartIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.7, mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            سلة التسوق فارغة
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            لم تقم بإضافة أي منتجات بعد
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            fullWidth
            onClick={onClose}
          >
            تصفح المنتجات
          </Button>
        </Box>
      </Popover>
    );
  }

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: 350 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingBagIcon sx={{ mr: 1 }} fontSize="small" />
            السلة ({cart.items.length})
          </Typography>
        </Box>
        
        <List sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
          {cart.items.map((item) => (
            <ListItem
              key={item._id}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="حذف" 
                  size="small"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
              divider
            >
              <ListItemAvatar>
                <Avatar 
                  src={item.image || '/assets/images/placeholder.png'} 
                  alt={item.name}
                  variant="rounded"
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <Box>
                    <Typography variant="body2" component="span">
                      {item.quantity} × {item.price} ر.س
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      component="div" 
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {(item.price * item.quantity).toFixed(2)} ر.س
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">المجموع الفرعي:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {cart.subtotal} ر.س
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">الشحن:</Typography>
            <Typography variant="body2">
              {cart.shippingCost > 0 ? `${cart.shippingCost} ر.س` : 'مجاني'}
            </Typography>
          </Box>
          
          <Button
            component={RouterLink}
            to="/cart"
            variant="contained"
            color="primary"
            fullWidth
            onClick={onClose}
            sx={{ mb: 1 }}
          >
            عرض السلة
          </Button>
          
          <Button
            component={RouterLink}
            to="/checkout"
            variant="outlined"
            fullWidth
            onClick={onClose}
          >
            إتمام الشراء
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default MiniCart;