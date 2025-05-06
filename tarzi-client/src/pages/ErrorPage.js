// src/pages/ErrorPage.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom align="center">
          عفواً، الصفحة غير موجودة
        </Typography>
        
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          الصفحة التي تبحث عنها غير متاحة أو تم نقلها إلى عنوان آخر.
        </Typography>
        
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/"
          >
            العودة للصفحة الرئيسية
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate(-1)}
          >
            الرجوع للصفحة السابقة
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorPage;