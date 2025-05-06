import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Pagination
} from '@mui/material';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, error, totalPages, page, onPageChange }) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography variant="h6">
          {t('product.noProductsFound')}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductList;