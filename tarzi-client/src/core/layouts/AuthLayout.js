// src/core/layouts/AuthLayout.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // إذا كان المستخدم مسجل بالفعل، يتم توجيهه إلى الصفحة الرئيسية
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4 
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            fontWeight="bold" 
            color="primary"
          >
            تارزي
          </Typography>
          <Typography variant="body1" color="text.secondary">
            منصة الأزياء المخصصة والخدمات المهنية
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;