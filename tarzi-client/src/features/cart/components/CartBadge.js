// src/features/cart/components/CartBadge.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';

const CartBadge = ({ color = 'primary' }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const itemsCount = cart?.items?.length || 0;
  
  const handleClick = () => {
    navigate('/cart');
  };
  
  return (
    <Tooltip title="سلة التسوق">
      <IconButton color={color} onClick={handleClick} aria-label="سلة التسوق">
        <Badge badgeContent={itemsCount} color="error" overlap="circular">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default CartBadge;