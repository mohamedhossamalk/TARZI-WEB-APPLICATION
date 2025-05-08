// src/core/layouts/components/Footer.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', mt: 4, pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* معلومات الشركة */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              تارزي
            </Typography>
            <Typography variant="body2" paragraph>
              منصة متخصصة في الأزياء المخصصة والخدمات المهنية لتلبية جميع احتياجاتك من الملابس والأزياء.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="فيسبوك">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="تويتر">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="إنستغرام">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="لينكدإن">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="يوتيوب">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
          
          {/* الروابط السريعة */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              روابط سريعة
            </Typography>
            <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/" color="inherit">
                  الرئيسية
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/products" color="inherit">
                  المنتجات
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/services" color="inherit">
                  الخدمات المهنية
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/profile" color="inherit">
                  الملف الشخصي
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/cart" color="inherit">
                  سلة التسوق
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* معلومات الاتصال */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              اتصل بنا
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2 }} />
                <Typography variant="body2">
                  القاهرة، مصر
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2 }} />
                <Typography variant="body2">
                  +20123456789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2 }} />
                <Typography variant="body2">
                  info@tarzi.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} تارزي - جميع الحقوق محفوظة
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;