// src/features/products/components/ProductGrid.js
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], favoriteProductIds = [], onToggleFavorite }) => {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لم يتم العثور على منتجات
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <ProductCard 
            product={product} 
            isFavorite={favoriteProductIds?.includes(product._id)}
            onToggleFavorite={onToggleFavorite}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;