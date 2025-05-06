import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon
} from '@mui/icons-material';
import { removeFromCart, updateCartItem } from '../../store/actions/cartActions';

const CartItem = ({ item }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(item._id, item.fabricChoice, item.colorChoice));
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      dispatch(updateCartItem(item._id, item.fabricChoice, item.colorChoice, value));
    }
  };
  
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        width: '100%'
      }}
    >
      {/* Product Image */}
      <Box
        component="img"
        sx={{
          width: 100,
          height: 100,
          objectFit: 'cover',
          mr: 2
        }}
        src={item.imageUrl || 'https://placehold.co/100x100?text=Tarzi'}
        alt={item.name}
      />
      
      {/* Product Info */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('product.fabric')}: {item.fabricChoice}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('product.color')}: {item.colorChoice}
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">
            {t('product.price')}:
          </Typography>
          <Typography variant="body1">
            {item.price?.toLocaleString()} {t('common.currency')}
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={2}>
          <TextField
            label={t('product.quantity')}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            size="small"
            value={item.quantity}
            onChange={handleQuantityChange}
          />
        </Grid>
        
        <Grid item xs={6} sm={2}>
          <Typography variant="body2" color="text.secondary">
            {t('product.total')}:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {(item.price * item.quantity).toLocaleString()} {t('common.currency')}
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={1} sx={{ textAlign: 'right' }}>
          <IconButton
            color="error"
            onClick={handleRemoveFromCart}
            aria-label={t('cart.remove')}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItem;