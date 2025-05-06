import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Paper
} from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Check if there's a redirect parameter
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('auth.login')}
        </Typography>
        
        {redirect && redirect === 'checkout' && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography align="center">
              {t('auth.loginToCheckout')}
            </Typography>
          </Paper>
        )}
        
        <LoginForm redirect={redirect} />
      </Box>
    </Container>
  );
};

export default LoginPage;