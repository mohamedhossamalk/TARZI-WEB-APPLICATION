import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('app.name')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.description')}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="youtube">
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Quick links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer.quickLinks')}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/products" color="inherit">
                  {t('nav.products')}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/orders" color="inherit">
                  {t('nav.orders')}
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/measurements" color="inherit">
                  {t('nav.measurements')}
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Contact info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer.contactUs')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('footer.address')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.email')}: <Link href="mailto:info@tarzi-app.com" color="inherit">info@tarzi-app.com</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.phone')}: <Link href="tel:+1234567890" color="inherit">+1 (234) 567-890</Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} {t('app.name')}. {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;