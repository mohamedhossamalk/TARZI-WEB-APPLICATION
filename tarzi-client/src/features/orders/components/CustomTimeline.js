// src/features/orders/components/CustomTimeline.js
import React from 'react';
import { Box } from '@mui/material';

export const CustomTimeline = ({ children, position = 'right' }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          left: position === 'right' ? 16 : 'auto',
          right: position === 'left' ? 16 : 'auto',
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: 'grey.300',
          zIndex: 0
        }}
      />
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export const CustomTimelineItem = ({ children }) => {
  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      {children}
    </Box>
  );
};

export const CustomTimelineSeparator = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 8,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translateX(-50%)',
        zIndex: 1
      }}
    >
      {children}
    </Box>
  );
};

export const CustomTimelineDot = ({ children, color = 'primary' }) => {
  const bgColor = {
    primary: 'primary.main',
    secondary: 'secondary.main',
    success: 'success.main',
    error: 'error.main',
    info: 'info.main',
    warning: 'warning.main',
    default: 'grey.400'
  }[color];

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: bgColor || 'primary.main',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

export const CustomTimelineConnector = () => {
  return (
    <Box
      sx={{
        height: 40,
        width: 2,
        bgcolor: 'grey.300',
        my: 1
      }}
    />
  );
};

export const CustomTimelineContent = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        pl: 5,
        pt: 0.5,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};