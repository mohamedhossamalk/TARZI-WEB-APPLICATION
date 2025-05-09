// src/features/notifications/services/notificationService.js
import api from '../../../core/api/axios-config';

// محاكاة بيانات الإشعارات للتطوير
const mockNotifications = [
  {
    _id: 'notification1',
    title: 'تم شحن طلبك',
    body: 'تم شحن طلبك رقم #ORD-12345 وسيتم توصيله خلال 2-3 أيام.',
    type: 'order',
    read: false,
    data: {
      orderId: 'order1'
    },
    link: '/orders/order1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    _id: 'notification2',
    title: 'رسالة جديدة',
    body: 'لديك رسالة جديدة من أحمد محمد بخصوص خدمة تفصيل البدلة.',
    type: 'message',
    read: true,
    data: {
      conversationId: 'conversation1'
    },
    link: '/messages/conversation1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    _id: 'notification3',
    title: 'خصم 10% على جميع المنتجات',
    body: 'استمتع بخصم 10% على جميع المنتجات لمدة 24 ساعة فقط!',
    type: 'offer',
    read: false,
    data: {
      offerId: 'offer1'
    },
    link: '/offers/offer1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    _id: 'notification4',
    title: 'تحديث الحساب',
    body: 'تم تحديث معلومات حسابك بنجاح.',
    type: 'system',
    read: true,
    link: '/profile',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    _id: 'notification5',
    title: 'تم تأكيد طلبك',
    body: 'تم تأكيد طلبك رقم #ORD-12346 وجاري تجهيزه الآن.',
    type: 'order',
    read: false,
    data: {
      orderId: 'order2'
    },
    link: '/orders/order2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    _id: 'notification6',
    title: 'رسالة جديدة',
    body: 'لديك رسالة جديدة من خدمة العملاء.',
    type: 'message',
    read: false,
    data: {
      conversationId: 'conversation2'
    },
    link: '/messages/conversation2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];

// محاكاة إعدادات الإشعارات للتطوير
const mockSettings = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  notificationTypes: {
    order: true,
    message: true,
    system: true,
    offer: true
  }
};

const notificationService = {
  // جلب جميع الإشعارات
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          notifications: mockNotifications,
          unreadCount: mockNotifications.filter(n => !n.read).length
        }
      };
    }
  },
  
  // وضع علامة على إشعار كمقروء
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },
  
  // وضع علامة على جميع الإشعارات كمقروءة
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
  
  // حذف إشعار معين
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },
  
  // حذف جميع الإشعارات
  deleteAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },
  
  // جلب إعدادات الإشعارات
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          settings: mockSettings
        }
      };
    }
  },
  
  // تحديث إعدادات الإشعارات
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/notifications/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }
};

export default notificationService;