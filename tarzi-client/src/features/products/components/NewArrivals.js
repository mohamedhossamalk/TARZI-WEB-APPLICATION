// src/features/products/components/NewArrivals.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ProductCard from './ProductCard';
import productService from '../services/productService';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await productService.getNewArrivals();
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setError('حدث خطأ أثناء جلب المنتجات الجديدة');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد منتجات جديدة متاحة حالياً
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Box sx={{ position: 'relative' }}>
              <ProductCard product={product} />
              <Chip
                icon={<NewReleasesIcon />}
                label="جديد"
                color="secondary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 1
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          component={RouterLink}
          to="/products?sortBy=newest"
          variant="outlined"
          color="primary"
          endIcon={<ArrowBackIcon />}
        >
          عرض المزيد من المنتجات الجديدة
        </Button>
      </Box>
    </Box>
  );
};

export default NewArrivals;