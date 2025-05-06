import React from 'react';
import { 
  Alert as MuiAlert, 
  AlertTitle, 
  Snackbar 
} from '@mui/material';

const Alert = ({ 
  severity = 'info', 
  title, 
  message, 
  open = true, 
  onClose, 
  autoHideDuration = 6000,
  variant = 'filled',
  isSnackbar = false
}) => {
  const alertComponent = (
    <MuiAlert 
      elevation={6} 
      variant={variant} 
      severity={severity}
      onClose={onClose}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MuiAlert>
  );
  
  if (isSnackbar) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {alertComponent}
      </Snackbar>
    );
  }
  
  return open ? alertComponent : null;
};

export default Alert;