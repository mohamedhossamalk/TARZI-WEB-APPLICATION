// src/features/products/components/RelatedProducts.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid, // استخدم Grid بدلاً من Swiper
} from '@mui/material';
import ProductCard from './ProductCard';
import productService from '../services/productService';

// نستبدل Swiper بنظام Grid من Material UI

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getRelatedProducts(categoryId, currentProductId);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('حدث خطأ أثناء جلب المنتجات ذات الصلة');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (products.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        لا توجد منتجات مشابهة متاحة حالياً
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;