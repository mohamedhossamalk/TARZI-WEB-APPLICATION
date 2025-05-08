// src/core/hooks/useNotifications.js
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications يجب أن يستخدم داخل NotificationProvider');
  }
  
  return context;
};