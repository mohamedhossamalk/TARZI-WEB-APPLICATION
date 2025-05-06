import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import ProductDetails from '../components/products/ProductDetails';
import { getProductDetails } from '../store/actions/productActions';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('nav.home')}
        </Link>
        <Link
          component={RouterLink}
          to="/products"
          color="inherit"
        >
          {t('nav.products')}
        </Link>
        {product && (
          <Typography color="text.primary">{product.name}</Typography>
        )}
      </Breadcrumbs>
      
      {/* Product Details */}
      <ProductDetails product={product} />
      
      <Divider sx={{ my: 6 }} />
      
      {/* Related Products Section (Simplified) */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          {t('product.relatedProducts')}
        </Typography>
        
        <Grid container spacing={3}>
          {/* This would be populated with actual related products from the API */}
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              {t('product.noRelatedProducts')}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;