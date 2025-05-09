// src/common/components/LoadingScreen.js
import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

// تعريف الرسوم المتحركة
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const LoadingScreen = ({ message = 'جاري التحميل...' }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
        animation: `${fadeIn} 0.4s ease-in`
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: 3,
          maxWidth: 400,
          width: '100%',
          animation: `${scaleUp} 0.5s ease-out`
        }}
      >
        {/* اسم التطبيق بدلاً من الشعار */}
        <Typography 
          variant="h2" 
          color="primary" 
          fontWeight="bold"
          sx={{ 
            mb: 3,
            animation: `${float} 3s ease-in-out infinite`,
            textShadow: `2px 2px 4px ${theme.palette.primary.main}40`,
            fontFamily: 'cursive, "Roboto"'
          }}
        >
          تارزي
        </Typography>
        
        {/* دائرة التحميل */}
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            mb: 3
          }}
        />
        
        {/* رسالة التحميل */}
        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            animation: `${fadeIn} 1s ease-in`
          }}
        >
          {message}
        </Typography>
      </Box>
      
      {/* نص الحقوق */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 4,
          opacity: 0.7
        }}
      >
        © {new Date().getFullYear()} تارزي - جميع الحقوق محفوظة
      </Typography>
    </Box>
  );
};

export default LoadingScreen;