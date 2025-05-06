import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography
} from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('auth.register')}
        </Typography>
        
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;