// src/common/components/AdvancedLoadingScreen.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, useTheme, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

// تعريف الرسوم المتحركة
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const messages = [
  'جاري تجهيز التطبيق...',
  'جاري تحميل البيانات...',
  'لحظات وتنطلق...',
  'نؤمن بالتفصيل المتميز...',
  'خياطة على مقاسك...'
];

const AdvancedLoadingScreen = ({ duration = 3000 }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(10);
  const [messageIndex, setMessageIndex] = useState(0);
  
  // مؤثر لزيادة شريط التقدم
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (duration / 100);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
    };
  }, [duration]);
  
  // مؤثر لتغيير الرسالة
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, duration / 5);
    
    return () => {
      clearInterval(messageTimer);
    };
  }, [duration]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(45deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`
          : `linear-gradient(45deg, ${theme.palette.grey[100]}, ${theme.palette.background.default})`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* عناصر الخلفية المزخرفة */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: '50%',
            background: `${theme.palette.primary.main}${Math.floor(Math.random() * 30) + 10}`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
            animation: `${pulse} ${Math.random() * 5 + 3}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 5,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 15,
          maxWidth: 450,
          width: '90%',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* اسم التطبيق بخط جميل بدلاً من الشعار */}
        <Typography
          variant="h1"
          color="primary"
          sx={{
            fontWeight: 700,
            fontFamily: 'cursive, "Roboto"',
            mb: 4,
            textAlign: 'center',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `1px 1px 2px ${theme.palette.primary.main}40`,
            fontSize: { xs: '3rem', sm: '4rem' },
            animation: `${pulse} 2s infinite ease-in-out`
          }}
        >
          تارزي
        </Typography>
        
        {/* رسالة التحميل */}
        <Box sx={{ height: 40, mb: 3, textAlign: 'center' }}>
          <Fade key={messageIndex} in={true} timeout={500}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 500
              }}
            >
              {messages[messageIndex]}
            </Typography>
          </Fade>
        </Box>
        
        {/* شريط التقدم */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }}
          />
        </Box>
        
        {/* نسبة التقدم */}
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}%
        </Typography>
      </Box>
      
      {/* نص الحقوق */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 4,
          zIndex: 1
        }}
      >
        تجربة خياطة فريدة تنتظرك...
      </Typography>
    </Box>
  );
};

export default AdvancedLoadingScreen;