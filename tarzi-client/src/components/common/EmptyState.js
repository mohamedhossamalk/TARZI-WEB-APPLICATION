import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Empty state component to display when there's no data
 * @param {Object} props Component props
 * @param {string} props.title Title of the empty state
 * @param {string} props.message Message to display
 * @param {React.ReactNode} props.icon Icon to display
 * @param {string} props.actionText Text for action button
 * @param {Function} props.actionHandler Function to call when button is clicked
 */
const EmptyState = ({
  title,
  message,
  icon,
  actionText,
  actionHandler,
  ...rest
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        ...rest.sx
      }}
      {...rest}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary', fontSize: 60 }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
      )}
      
      {actionText && actionHandler && (
        <Button
          variant="contained"
          onClick={actionHandler}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;