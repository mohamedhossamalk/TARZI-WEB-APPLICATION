// src/common/components/LottieLoadingScreen.js
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Lottie from 'lottie-react';
import tailoringAnimation from '../../assets/animations/tailoring-animation.json'; // استبدل بملف الرسوم المتحركة الخاص بك

const LottieLoadingScreen = ({ message = 'جاري تحضير تجربة خياطة فريدة...' }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 600,
          width: '100%',
          padding: 3
        }}
      >
        {/* رسوم متحركة Lottie */}
        <Lottie
          animationData={tailoringAnimation}
          style={{ width: 300, height: 300 }}
          loop={true}
        />
        
        {/* رسالة التحميل */}
        <Typography
          variant="h5"
          color="text.primary"
          sx={{
            fontWeight: 500,
            mt: 3,
            textAlign: 'center',
            animation: 'fadeIn 1s infinite alternate',
            '@keyframes fadeIn': {
              '0%': { opacity: 0.6 },
              '100%': { opacity: 1 }
            }
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LottieLoadingScreen;