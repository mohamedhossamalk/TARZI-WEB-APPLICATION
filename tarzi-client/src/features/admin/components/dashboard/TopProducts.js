// src/features/admin/components/dashboard/TopProducts.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider
} from '@mui/material';

const TopProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  if (!products.length) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد بيانات لأفضل المنتجات
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {products.map((product, index) => (
        <React.Fragment key={product._id}>
          <ListItem 
            alignItems="flex-start" 
            button 
            onClick={() => handleProductClick(product._id)}
            sx={{ py: 1.5 }}
          >
            <ListItemAvatar>
              <Avatar
                alt={product.name}
                src={product.image || '/assets/images/placeholder.png'}
                variant="rounded"
                sx={{ width: 50, height: 50 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'block' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {product.salesCount} مبيعات
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                  >
                    {product.price} ج.م
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < products.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TopProducts;