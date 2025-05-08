// src/features/products/pages/HomePage.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Corregir importación
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Divider, // Añadir Divider
  Skeleton, // Añadir Skeleton
} from '@mui/material';

import { ArrowLeft } from '@mui/icons-material';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useQuery } from 'react-query';
import { ShoppingBag, Star } from '@mui/icons-material';
// بانر الصفحة الرئيسية
const HeroBanner = () => (
  <Box
    sx={{
      position: 'relative',
      height: { xs: '60vh', md: '70vh' },
      backgroundImage: 'url(/assets/images/banner.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    }}
  >
    <Container sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ maxWidth: '600px' }}>
        <Typography variant="h2" gutterBottom fontWeight="bold">
          تارزي - الأناقة المصممة خصيصاً لك
        </Typography>
        <Typography variant="h6" paragraph>
          مع تارزي، استمتع بتجربة تصميم ملابسك بمقاساتك الدقيقة واختيارك من أفضل الأقمشة والتصاميم
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          تصفح المنتجات
        </Button>
      </Box>
    </Container>
  </Box>
);

// قسم الميزات
const FeaturesSection = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        لماذا تختار تارزي؟
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        نقدم لك تجربة فريدة في عالم الأزياء والملابس المخصصة
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="/assets/icons/custom-tailoring.png"
                alt="تفصيل مخصص"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                تفصيل مخصص
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نصمم ملابسك حسب مقاساتك الدقيقة لتضمن لك الراحة والمظهر المثالي
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="/assets/icons/fabric-quality.png"
                alt="جودة الأقمشة"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                جودة الأقمشة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نستخدم أفضل أنواع الأقمشة ذات الجودة العالية وبألوان متنوعة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="/assets/icons/professional-service.png"
                alt="خدمات مهنية"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                خدمات مهنية
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نوفر خدمات مهنية متكاملة بواسطة محترفين في مجال الأزياء والتصميم
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="/assets/icons/delivery.png"
                alt="توصيل سريع"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                توصيل سريع
              </Typography>
              <Typography variant="body2" color="text.secondary">
                نضمن لك استلام منتجاتك في الوقت المحدد وبأعلى مستويات الجودة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// المنتجات المميزة
const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery(
    'featuredProducts',
    () => productService.getFeaturedProducts(8)
  );

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(4)).map((_, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={30} width="80%" />
                <Skeleton variant="text" height={20} width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">
          حدث خطأ في تحميل المنتجات المميزة. يرجى المحاولة مرة أخرى.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products && products.map((product) => (
        <Grid item key={product._id} xs={12} sm={6} md={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

// قسم الخدمات المهنية
const ProfessionalServices = () => (
  <Box sx={{ py: 8 }}>
    <Container>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        الخدمات المهنية
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        نقدم مجموعة متكاملة من الخدمات المهنية في مجال الأزياء والتصميم
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/assets/images/professional-services/tailoring.jpg"
              alt="الخياطة المهنية"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                الخياطة المهنية
              </Typography>
              <Typography variant="body2" color="text.secondary">
                خدمات الخياطة المهنية لجميع أنواع الملابس بأيدي خبراء محترفين
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/services?category=tailoring"
                size="small"
                endIcon={<ArrowLeft />}
              >
                المزيد
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/assets/images/professional-services/design.jpg"
              alt="تصميم الأزياء"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                تصميم الأزياء
              </Typography>
              <Typography variant="body2" color="text.secondary">
                تصميم أزياء فريدة ومبتكرة تناسب جميع المناسبات والأذواق
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/services?category=design"
                size="small"
                endIcon={<ArrowLeft />}
              >
                المزيد
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/assets/images/professional-services/styling.jpg"
              alt="الاستايل والتنسيق"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                الاستايل والتنسيق
              </Typography>
              <Typography variant="body2" color="text.secondary">
                خدمات تنسيق الملابس واختيار الأزياء المناسبة لمختلف المناسبات
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/services?category=styling"
                size="small"
                endIcon={<ArrowLeft />}
              >
                المزيد
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          component={RouterLink}
          to="/services"
          variant="outlined"
          color="primary"
          size="large"
        >
          عرض جميع الخدمات
        </Button>
      </Box>
    </Container>
  </Box>
);

// قسم الشهادات والمراجعات
const Testimonials = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        آراء العملاء
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        ماذا يقول عملاؤنا عن خدماتنا ومنتجاتنا
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "تجربتي مع تارزي كانت رائعة. الجودة ممتازة والتفصيل دقيق جداً وتم تسليم القطع في الموعد المحدد."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar
                  alt="أحمد محمد"
                  src="/assets/images/testimonials/person1.jpg"
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">أحمد محمد</Typography>
                  <Typography variant="caption" color="text.secondary">
                    عميل منذ 2021
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "خدمة ممتازة وأقمشة عالية الجودة. أنا أتعامل مع تارزي منذ سنتين ولم تخذلني أبداً. أنصح الجميع بتجربتها."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar
                  alt="سارة أحمد"
                  src="/assets/images/testimonials/person2.jpg"
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">سارة أحمد</Typography>
                  <Typography variant="caption" color="text.secondary">
                    عميلة منذ 2022
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "استعنت بخدمات تارزي لتفصيل بدلة زفافي. كانت النتيجة أكثر من رائعة والتعامل احترافي جداً."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar
                  alt="محمود علي"
                  src="/assets/images/testimonials/person3.jpg"
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">محمود علي</Typography>
                  <Typography variant="caption" color="text.secondary">
                    عميل منذ 2023
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// الصفحة الرئيسية
const HomePage = () => {
  return (
    <Box>
      <HeroBanner />
      
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            منتجاتنا المميزة
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            تصاميم حصرية وأقمشة فاخرة لمختلف المناسبات
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <FeaturedProducts />
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/products"
              variant="outlined"
              color="primary"
              size="large"
            >
              عرض جميع المنتجات
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Divider />
      
      <FeaturesSection />
      
      <Divider />
      
      <ProfessionalServices />
      
      <Divider />
      
      <Testimonials />
    </Box>
  );
};

export default HomePage;