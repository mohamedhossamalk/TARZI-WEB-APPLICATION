// src/utils/axiosConfig.js
import axios from 'axios';

// تكوين القاعدي للـ axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// إضافة معترض للطلبات لإرفاق توكن المصادقة إن وجد
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة معترض للاستجابات للتعامل مع أخطاء مصادقة أو انتهاء صلاحية التوكن
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // انتهت صلاحية الجلسة أو خطأ مصادقة
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;