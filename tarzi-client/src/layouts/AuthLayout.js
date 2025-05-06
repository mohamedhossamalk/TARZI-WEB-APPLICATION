// src/layouts/AuthLayout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import logo from '../assets/logo.png'; // قم بإضافة شعار التطبيق

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* رأس الصفحة مع الشعار */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={logo} alt="تَرزي" style={{ height: '60px', width: 'auto' }} />
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'text.primary' }}>
              تَرزي
            </Typography>
          </Link>
        </Box>
        
        {/* محتوى الصفحة */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Paper>
        
        {/* تذييل الصفحة */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} تَرزي - جميع الحقوق محفوظة
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;