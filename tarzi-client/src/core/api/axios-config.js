// src/core/api/axios-config.js
import axios from 'axios';
import { toast } from 'react-toastify';

// إنشاء نسخة من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 ثانية
});

// إضافة معالج للإرسال (interceptor)
api.interceptors.request.use(
  (config) => {
    // الحصول على التوكن من التخزين المحلي
    const token = localStorage.getItem('token');
    
    // إضافة التوكن إلى الهيدر إذا كان موجودًا
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة معالج للاستجابة (interceptor)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // معالجة أخطاء التوثيق (401)
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
          toast.error('انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.');
        }
      }
      
      // عرض رسالة الخطأ
      const errorMessage = response.data?.message || 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
      toast.error(errorMessage);
    } else {
      // خطأ في الاتصال
      toast.error('حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.');
    }
    
    return Promise.reject(error);
  }
);

export default api;