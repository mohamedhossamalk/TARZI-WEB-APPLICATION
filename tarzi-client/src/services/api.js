import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // إضافة مهلة زمنية معقولة
});

// تعيين رمز المصادقة للطلبات
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  }
};

// اعتراض الطلبات لإضافة رمز المصادقة وتسجيل معلومات التصحيح
API.interceptors.request.use((config) => {
  // طباعة تفاصيل الطلب للتشخيص
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });

  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // التأكد من تنسيق البيانات المرسلة
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
      if (Object.keys(config.data).length === 0) {
        // تجنب إرسال كائن فارغ
        config.data = null;
      }
    }
  }
  
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// اعتراض الاستجابات للتعامل مع الأخطاء
API.interceptors.response.use(
  (response) => {
    console.log(`API Success [${response.config.url}]:`, response.data);
    return response;
  },
  (error) => {
    // طباعة تفاصيل الخطأ للتشخيص
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      requestData: error.config?.data,
      requestHeaders: error.config?.headers
    });
    
    // Network errors
    if (!error.response) {
      console.error('Network Error: يرجى التحقق من اتصال الإنترنت أو أن الخادم يعمل');
    }
    else if (error.response.status === 400) {
      console.error('400 Bad Request:', error.response.data);
    }
    // Handle 401 Unauthorized responses
    else if (error.response.status === 401) {
      console.error('401 Unauthorized: تم رفض الوصول');
      // حذف معلومات التفويض عند انتهاء صلاحية التوكن
      setAuthToken(null);
    }
    
    return Promise.reject(error);
  }
);

export default API;
