// src/hooks/useToast.jsx
import { toast } from 'react-toastify';

export const useToast = () => {
  const showToast = (message, type = 'info', options = {}) => {
    const toastOptions = {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      rtl: true,
      ...options,
    };
    
    switch (type) {
      case 'success':
        return toast.success(message, toastOptions);
      case 'error':
        return toast.error(message, toastOptions);
      case 'warning':
        return toast.warning(message, toastOptions);
      case 'info':
      default:
        return toast.info(message, toastOptions);
    }
  };
  
  return { showToast };
};