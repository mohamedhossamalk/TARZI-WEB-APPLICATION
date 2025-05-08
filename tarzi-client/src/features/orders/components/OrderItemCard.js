// src/features/orders/components/OrderItemCard.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { formatCurrency } from '../../../core/utils/formatters';

const OrderItemCard = ({ item }) => {
  return (
    <Card variant="outlined">
      {item.image && (
        <CardMedia
          component="img"
          height="140"
          image={item.image}
          alt={item.name}
        />
      )}
      <CardContent>
        <Typography variant="subtitle1" component={RouterLink} to={`/products/${item.productId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
          {item.name}
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            الكمية: {item.quantity}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            السعر: {formatCurrency(item.price)}
          </Typography>
          
          <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
            الإجمالي: {formatCurrency(item.price * item.quantity)}
          </Typography>
        </Box>
        
        {item.fabricChoice && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              القماش: {item.fabricChoice}
            </Typography>
          </Box>
        )}
        
        {item.colorChoice && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              اللون: {item.colorChoice}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;