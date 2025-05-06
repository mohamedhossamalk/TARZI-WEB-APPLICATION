// src/components/common/Footer.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import logo from '../../assets/logo.png'; // يجب إضافة شعار للتطبيق

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* معلومات العلامة التجارية */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <img src={logo} alt="تَرزي" style={{ height: '40px', marginLeft: '8px' }} />
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                تَرزي
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              منصة تَرزي تقدم خدمات الخياطة المخصصة وبيع الملابس العصرية بأعلى معايير الجودة والتصميم.
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <IconButton
                aria-label="facebook"
                color="primary"
                href="https://facebook.com"
                target="_blank"
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="twitter"
                color="primary"
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="instagram"
                color="primary"
                href="https://instagram.com"
                target="_blank"
              >
                <Instagram />
              </IconButton>
              <IconButton
                aria-label="youtube"
                color="primary"
                href="https://youtube.com"
                target="_blank"
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
          
          {/* روابط سريعة */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              روابط سريعة
            </Typography>
            <Box component="nav">
              <Link component={RouterLink} to="/" color="inherit" display="block" mb={1}>
                الرئيسية
              </Link>
              <Link component={RouterLink} to="/products" color="inherit" display="block" mb={1}>
                المنتجات
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" display="block" mb={1}>
                من نحن
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" display="block" mb={1}>
                اتصل بنا
              </Link>
            </Box>
          </Grid>
          
          {/* معلومات المستخدم */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              حسابي
            </Typography>
            <Box component="nav">
              <Link component={RouterLink} to="/login" color="inherit" display="block" mb={1}>
                تسجيل الدخول
              </Link>
              <Link component={RouterLink} to="/register" color="inherit" display="block" mb={1}>
                إنشاء حساب
              </Link>
              <Link component={RouterLink} to="/profile" color="inherit" display="block" mb={1}>
                الملف الشخصي
              </Link>
              <Link component={RouterLink} to="/orders" color="inherit" display="block" mb={1}>
                طلباتي
              </Link>
            </Box>
          </Grid>
          
          {/* معلومات الاتصال */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              تواصل معنا
            </Typography>
            <Box>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  المملكة العربية السعودية، الرياض
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Link href="tel:+966123456789" color="inherit">
                  +966 12 345 6789
                </Link>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Link href="mailto:info@tarzi-app.com" color="inherit">
                  info@tarzi-app.com
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* حقوق النشر */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} تَرزي - جميع الحقوق محفوظة
          </Typography>
          <Box mt={1}>
            <Link component={RouterLink} to="/privacy-policy" color="inherit" sx={{ mx: 1 }}>
              سياسة الخصوصية
            </Link>
            |
            <Link component={RouterLink} to="/terms-of-service" color="inherit" sx={{ mx: 1 }}>
              شروط الخدمة
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;