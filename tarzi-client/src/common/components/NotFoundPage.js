// src/common/components/NotFoundPage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied as SadIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        textAlign: 'center',
        p: 3,
      }}
    >
      <SadIcon sx={{ fontSize: 100, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
      <Typography variant="h3" gutterBottom fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        الصفحة غير موجودة
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 3 }}>
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        size="large"
      >
        العودة للصفحة الرئيسية
      </Button>
    </Box>
  );
};

export default NotFoundPage;