// src/features/products/components/CustomizationSection.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Straighten as MeasureIcon,
  Style as FabricIcon,
  FormatColorFill as ColorIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const CustomizationSection = () => {
  const customizationFeatures = [
    {
      icon: <MeasureIcon sx={{ fontSize: 40 }} />,
      title: 'مقاسات مخصصة',
      description: 'أضف مقاساتك الدقيقة للحصول على ملابس تناسبك تماماً',
      image: '/assets/images/customization/measurements.jpg',
      link: '/measurements'
    },
    {
      icon: <FabricIcon sx={{ fontSize: 40 }} />,
      title: 'اختيار الأقمشة',
      description: 'تشكيلة واسعة من الأقمشة عالية الجودة لاختيار ما يناسبك',
      image: '/assets/images/customization/fabrics.jpg',
      link: '/products?category=fabrics'
    },
    {
      icon: <ColorIcon sx={{ fontSize: 40 }} />,
      title: 'تخصيص الألوان',
      description: 'اختر من بين مجموعة متنوعة من الألوان لتعكس شخصيتك',
      image: '/assets/images/customization/colors.jpg',
      link: '/products'
    }
  ];

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Paper
        sx={{
          p: 4,
          backgroundImage: 'url(/assets/images/backgrounds/custom-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          position: 'relative',
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 2,
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            مجموعتنا المخصصة
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            استمتع بتجربة فريدة من نوعها مع خدمة التخصيص الكاملة. اختر المقاسات، الأقمشة، والألوان التي تناسب ذوقك وأسلوبك الخاص.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {customizationFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                      {feature.icon}
                      <Typography variant="h6" component="h3" sx={{ mr: 1 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={RouterLink} 
                      to={feature.link}
                      size="small" 
                      endIcon={<ArrowBackIcon />}
                    >
                      اكتشف المزيد
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/products?custom=true"
              variant="contained"
              color="primary"
              size="large"
            >
              استكشف المنتجات المخصصة
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomizationSection;