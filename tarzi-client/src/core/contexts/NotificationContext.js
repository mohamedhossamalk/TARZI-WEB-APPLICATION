// src/core/contexts/NotificationContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios-config';
import endpoints from '../api/endpoints';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // جلب الإشعارات غير المقروءة
  const fetchUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get(endpoints.notifications.getUnread);
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات غير المقروءة:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // جلب جميع الإشعارات
  const fetchAllNotifications = useCallback(async (page = 1, pageSize = 20) => {
    if (!isAuthenticated) return { notifications: [], pagination: { page: 1, pages: 1, total: 0 } };
    
    try {
      setLoading(true);
      const response = await api.get(endpoints.notifications.getAll, {
        params: { page, pageSize }
      });
      return {
        notifications: response.data.notifications || [],
        pagination: response.data.pagination || { page, pages: 1, total: 0 }
      };
    } catch (error) {
      console.error('خطأ في جلب جميع الإشعارات:', error);
      return { notifications: [], pagination: { page: 1, pages: 1, total: 0 } };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // وضع علامة كمقروء لإشعار
  const markAsRead = useCallback(async (id) => {
    if (!isAuthenticated) return;
    
    try {
      await api.put(endpoints.notifications.markAsRead(id));
      
      // تحديث حالة الإشعارات محلياً
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('خطأ في وضع علامة كمقروء للإشعار:', error);
    }
  }, [isAuthenticated]);

  // وضع علامة كمقروء لجميع الإشعارات
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await api.put(endpoints.notifications.markAllAsRead);
      
      // تحديث حالة الإشعارات محلياً
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('تم وضع علامة كمقروء لجميع الإشعارات');
    } catch (error) {
      console.error('خطأ في وضع علامة كمقروء لجميع الإشعارات:', error);
    }
  }, [isAuthenticated]);

  // حذف إشعار
  const deleteNotification = useCallback(async (id) => {
    if (!isAuthenticated) return;
    
    try {
      await api.delete(endpoints.notifications.delete(id));
      
      // تحديث حالة الإشعارات محلياً
      setNotifications(prev => prev.filter(notification => notification._id !== id));
      
      // تحديث عدد الإشعارات غير المقروءة إذا كان الإشعار غير مقروء
      const wasUnread = notifications.find(n => n._id === id && !n.isRead);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('تم حذف الإشعار بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الإشعار:', error);
    }
  }, [isAuthenticated, notifications]);

  // تهيئة الإشعارات
  const initializeNotifications = useCallback(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  // إعداد مؤقت لتحديث الإشعارات كل دقيقة
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // تحديث الإشعارات عند تحميل المكون
    fetchUnreadNotifications();
    
    // إعداد مؤقت لتحديث الإشعارات كل دقيقة
    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 60000); // 60 ثانية
    
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchUnreadNotifications,
    fetchAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    initializeNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};