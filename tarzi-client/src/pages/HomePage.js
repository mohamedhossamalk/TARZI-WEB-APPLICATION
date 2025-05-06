import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import ProductCard from '../components/products/ProductCard';
import { getFeaturedProducts } from '../store/actions/productActions';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { featuredProducts = [], loading } = useSelector(state => state.products);
  
  useEffect(() => {
    dispatch(getFeaturedProducts()).catch(error => {
      console.error('Failed to fetch featured products:', error);
    });
  }, [dispatch]);
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?tailor,fashion)',
          height: { xs: '50vh', md: '70vh' }
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        
        <Container
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
            }}
          >
            {t('home.hero.title')}
          </Typography>
          
          <Typography
            variant="h5"
            color="inherit"
            paragraph
            sx={{
              maxWidth: '600px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
              mb: 4
            }}
          >
            {t('home.hero.subtitle')}
          </Typography>
          
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            size="large"
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('home.hero.cta')}
          </Button>
        </Container>
      </Paper>
      
      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
        >
          {t('home.featuredProducts.title')}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          {t('home.featuredProducts.subtitle')}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <Box sx={{ py: 4, width: '100%', textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('product.noFeaturedProducts')}
                </Typography>
              </Box>
            )}
          </Grid>
        )}
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            size="large"
          >
            {t('home.featuredProducts.viewAll')}
          </Button>
        </Box>
      </Container>
      
      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h4"
            align="center"
            gutterBottom
          >
            {t('home.services.title')}
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 6 }}
          >
            {t('home.services.subtitle')}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box
                  component="img"
                  src="https://via.placeholder.com/150"
                  alt="Custom Tailoring"
                  sx={{
                    mb: 2,
                    width: 80,
                    height: 80,
                    objectFit: 'cover'
                  }}
                />
                
                <Typography variant="h6" gutterBottom>
                  {t('home.services.customTailoring.title')}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {t('home.services.customTailoring.description')}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box
                  component="img"
                  src="https://via.placeholder.com/150"
                  alt="Alterations"
                  sx={{
                    mb: 2,
                    width: 80,
                    height: 80,
                    objectFit: 'cover'
                  }}
                />
                
                <Typography variant="h6" gutterBottom>
                  {t('home.services.alterations.title')}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {t('home.services.alterations.description')}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box
                  component="img"
                  src="https://via.placeholder.com/150"
                  alt="Fabric Selection"
                  sx={{
                    mb: 2,
                    width: 80,
                    height: 80,
                    objectFit: 'cover'
                  }}
                />
                
                <Typography variant="h6" gutterBottom>
                  {t('home.services.fabricSelection.title')}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {t('home.services.fabricSelection.description')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;