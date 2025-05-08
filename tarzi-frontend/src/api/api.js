// src/api/api.js
import axios from 'axios';

// عنوان API - يمكن تعديله من خلال متغيرات البيئة
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// إنشاء نسخة من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// متغير للاحتفاظ بدالة تسجيل الخروج عند انتهاء صلاحية التوكن
let logoutHandler = null;

// تعيين دالة تسجيل الخروج (يتم استدعاؤها من AuthContext)
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// إضافة interceptor لإضافة توكن المصادقة للطلبات
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] طلب: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API] خطأ في الطلب:', error);
    return Promise.reject(error);
  }
);

// إدارة الأخطاء العامة
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] استجابة ناجحة: ${response.config.method?.toUpperCase() || 'GET'} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // طباعة معلومات الخطأ للتصحيح في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      if (error.response) {
        console.error(
          `[API] خطأ استجابة: ${error.config?.method?.toUpperCase() || 'GET'} ${error.config?.url} - الحالة: ${error.response.status}`,
          error.response.data
        );
      } else if (error.request) {
        console.error('[API] لم يتم استلام استجابة:', error.request);
      } else {
        console.error('[API] خطأ في إعداد الطلب:', error.message);
      }
    }
    
    // استخراج رسالة الخطأ
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // إضافة رسالة الخطأ إلى الكائن
    error.userMessage = errorMessage;
    
    // التعامل مع انتهاء صلاحية التوكن (رمز الخطأ 401)
    if (error.response && error.response.status === 401) {
      // التحقق ما إذا كان الطلب هو طلب تسجيل دخول أو تسجيل جديد
      const isAuthEndpoint = 
        error.config.url.includes('/auth/login') || 
        error.config.url.includes('/auth/register');
      
      // لا تقم بتسجيل الخروج إذا كانت محاولة تسجيل دخول فاشلة
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        
        if (logoutHandler) {
          logoutHandler();
        } else {
          window.location.href = '/login?message=session_expired';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// واجهة المصادقة
export const authAPI = {
  /**
   * تسجيل مستخدم جديد
   * @param {Object} userData بيانات المستخدم للتسجيل (username, email, password, phone)
   * @returns {Promise} وعد يحتوي على استجابة التسجيل
   */
  register: (userData) => {
    // تهيئة البيانات المرسلة للتوافق مع العقب
    const formattedData = { ...userData };
    
    // إذا تم توفير 'name' بدلاً من 'username'، قم بتحديث البيانات
    if (userData.name && !userData.username) {
      formattedData.username = userData.name;
      delete formattedData.name;
    }
    
    return api.post('/auth/register', formattedData);
  },
  
  /**
   * تسجيل دخول المستخدم
   * @param {Object} credentials بيانات الاعتماد (email, password)
   * @returns {Promise} وعد يحتوي على استجابة تسجيل الدخول
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * الحصول على بيانات المستخدم الحالي
   * @returns {Promise} وعد يحتوي على بيانات المستخدم الحالي
   */
  getCurrentUser: () => api.get('/auth/me'),
  
  /**
   * تحديث بيانات الملف الشخصي
   * @param {Object} userData بيانات المستخدم المحدثة
   * @returns {Promise} وعد يحتوي على بيانات المستخدم المحدثة
   */
  updateProfile: (userData) => api.put('/auth/updateprofile', userData),
  
  /**
   * تغيير كلمة المرور
   * @param {Object} passwordData بيانات كلمة المرور (currentPassword, newPassword)
   * @returns {Promise} وعد يحتوي على استجابة تغيير كلمة المرور
   */
  changePassword: (passwordData) => api.put('/auth/changepassword', passwordData),
  
  /**
   * طلب استعادة كلمة المرور
   * @param {Object} email البريد الإلكتروني المرتبط بالحساب
   * @returns {Promise} وعد يحتوي على استجابة طلب استعادة كلمة المرور
   */
  forgotPassword: (email) => api.post('/auth/forgotpassword', email),
  
  /**
   * إعادة تعيين كلمة المرور
   * @param {Object} data بيانات إعادة تعيين كلمة المرور (token, newPassword)
   * @returns {Promise} وعد يحتوي على استجابة إعادة تعيين كلمة المرور
   */
  resetPassword: (data) => api.post('/auth/resetpassword', data)
};

// واجهة المستخدم
export const userAPI = {
  /**
   * الحصول على الملف الشخصي
   * @returns {Promise} وعد يحتوي على بيانات الملف الشخصي
   */
  getProfile: () => api.get('/users/profile'),
  
  /**
   * تحديث الملف الشخصي
   * @param {Object} profileData بيانات الملف الشخصي المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الملف الشخصي المحدثة
   */
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  /**
   * تحديث كلمة المرور
   * @param {Object} passwordData بيانات كلمة المرور
   * @returns {Promise} وعد يحتوي على استجابة تحديث كلمة المرور
   */
  updatePassword: (passwordData) => api.put('/users/password', passwordData),
  
  /**
   * الحصول على عناوين المستخدم
   * @returns {Promise} وعد يحتوي على عناوين المستخدم
   */
  getAddresses: () => api.get('/users/addresses'),
  
  /**
   * إضافة عنوان جديد
   * @param {Object} addressData بيانات العنوان الجديد
   * @returns {Promise} وعد يحتوي على بيانات العنوان المضاف
   */
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  
  /**
   * تحديث عنوان
   * @param {string} id معرف العنوان
   * @param {Object} addressData بيانات العنوان المحدثة
   * @returns {Promise} وعد يحتوي على بيانات العنوان المحدثة
   */
  updateAddress: (id, addressData) => api.put(`/users/addresses/${id}`, addressData),
  
  /**
   * حذف عنوان
   * @param {string} id معرف العنوان
   * @returns {Promise} وعد يحتوي على استجابة حذف العنوان
   */
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`)
};

// واجهة الإدارة
export const adminAPI = {
  /**
   * الحصول على إحصائيات لوحة التحكم
   * @returns {Promise} وعد يحتوي على إحصائيات لوحة التحكم
   */
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  /**
   * الحصول على قائمة المستخدمين
   * @returns {Promise} وعد يحتوي على قائمة المستخدمين
   */
  getUsersList: () => api.get('/admin/users'),
  
  /**
   * تحديث حالة المستخدم
   * @param {string} id معرف المستخدم
   * @param {Object} data بيانات حالة المستخدم المحدثة
   * @returns {Promise} وعد يحتوي على بيانات المستخدم المحدثة
   */
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}`, data),
  
  /**
   * الحصول على إعدادات النظام
   * @returns {Promise} وعد يحتوي على إعدادات النظام
   */
  getSettings: () => api.get('/admin/settings'),
  
  /**
   * تحديث إعدادات النظام
   * @param {Object} settingsData بيانات الإعدادات المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الإعدادات المحدثة
   */
  updateSettings: (settingsData) => api.put('/admin/settings', settingsData),
  
  /**
   * الحصول على سجل الأنشطة
   * @returns {Promise} وعد يحتوي على سجل الأنشطة
   */
  getActivityLogs: () => api.get('/admin/activity-logs'),
  
  /**
   * الحصول على قائمة الطلبات
   * @returns {Promise} وعد يحتوي على قائمة الطلبات
   */
  getOrdersList: () => api.get('/admin/orders'),
  
  /**
   * تحديث حالة الطلب
   * @param {string} id معرف الطلب
   * @param {Object} data بيانات حالة الطلب المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الطلب المحدثة
   */
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}`, data),
  
  /**
   * الحصول على تفاصيل الطلب
   * @param {string} id معرف الطلب
   * @returns {Promise} وعد يحتوي على تفاصيل الطلب
   */
  getOrderDetails: (id) => api.get(`/admin/orders/${id}`)
};

// واجهة إدارة المستخدم (للمسؤول)
export const adminUserAPI = {
  /**
   * الحصول على جميع المستخدمين
   * @returns {Promise} وعد يحتوي على جميع المستخدمين
   */
  getAllUsers: () => api.get('/users'),
  
  /**
   * الحصول على مستخدم محدد
   * @param {string} id معرف المستخدم
   * @returns {Promise} وعد يحتوي على بيانات المستخدم
   */
  getUserById: (id) => api.get(`/users/${id}`),
  
  /**
   * تحديث مستخدم
   * @param {string} id معرف المستخدم
   * @param {Object} userData بيانات المستخدم المحدثة
   * @returns {Promise} وعد يحتوي على بيانات المستخدم المحدثة
   */
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  /**
   * حذف مستخدم
   * @param {string} id معرف المستخدم
   * @returns {Promise} وعد يحتوي على استجابة حذف المستخدم
   */
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  /**
   * تغيير حالة المستخدم
   * @param {string} id معرف المستخدم
   * @param {boolean} isActive حالة المستخدم
   * @returns {Promise} وعد يحتوي على بيانات المستخدم المحدثة
   */
  toggleUserStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
  
  /**
   * تغيير دور المستخدم
   * @param {string} id معرف المستخدم
   * @param {string} role دور المستخدم الجديد
   * @returns {Promise} وعد يحتوي على بيانات المستخدم المحدثة
   */
  changeUserRole: (id, role) => api.patch(`/users/${id}/role`, { role })
};

// واجهة المنتجات
export const productsAPI = {
  /**
   * الحصول على جميع المنتجات
   * @param {Object} params معلمات الاستعلام (keyword, category, active, page, pageSize)
   * @returns {Promise} وعد يحتوي على قائمة المنتجات
   */
  getAll: (params) => api.get('/products', { params }),
  
  /**
   * الحصول على المنتجات المميزة
   * @param {number} limit عدد المنتجات المطلوبة
   * @returns {Promise} وعد يحتوي على المنتجات المميزة
   */
  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  
  /**
   * الحصول على منتج محدد
   * @param {string} id معرف المنتج
   * @returns {Promise} وعد يحتوي على بيانات المنتج
   */
  getById: (id) => api.get(`/products/${id}`),
  
  /**
   * إنشاء منتج جديد
   * @param {Object} productData بيانات المنتج الجديد
   * @returns {Promise} وعد يحتوي على بيانات المنتج المنشأ
   */
  create: (productData) => api.post('/products', productData),
  
  /**
   * تحديث منتج
   * @param {string} id معرف المنتج
   * @param {Object} productData بيانات المنتج المحدثة
   * @returns {Promise} وعد يحتوي على بيانات المنتج المحدثة
   */
  update: (id, productData) => api.put(`/products/${id}`, productData),
  
  /**
   * حذف منتج
   * @param {string} id معرف المنتج
   * @returns {Promise} وعد يحتوي على استجابة حذف المنتج
   */
  delete: (id) => api.delete(`/products/${id}`),
  
  /**
   * تغيير حالة تمييز المنتج
   * @param {string} id معرف المنتج
   * @param {boolean} isFeatured حالة تمييز المنتج
   * @returns {Promise} وعد يحتوي على بيانات المنتج المحدثة
   */
  toggleFeatured: (id, isFeatured) => api.patch(`/products/${id}/featured`, { isFeatured }),
  
  /**
   * تحديث حالة المنتج
   * @param {string} id معرف المنتج
   * @param {boolean} isActive حالة المنتج
   * @returns {Promise} وعد يحتوي على بيانات المنتج المحدثة
   */
  updateStatus: (id, isActive) => api.put(`/products/${id}/status`, { isActive })
};

// واجهة الفئات
export const categoriesAPI = {
  /**
   * الحصول على جميع الفئات
   * @param {Object} params معلمات الاستعلام (showInactive)
   * @returns {Promise} وعد يحتوي على قائمة الفئات
   */
  getAll: (params) => api.get('/categories', { params }),
  
  /**
   * الحصول على الفئات المميزة
   * @param {number} limit عدد الفئات المطلوبة
   * @returns {Promise} وعد يحتوي على الفئات المميزة
   */
  getFeatured: (limit = 5) => api.get('/categories/featured', { params: { limit } }),
  
  /**
   * الحصول على فئة محددة
   * @param {string} id معرف الفئة
   * @returns {Promise} وعد يحتوي على بيانات الفئة
   */
  getById: (id) => api.get(`/categories/${id}`),
  
  /**
   * إنشاء فئة جديدة
   * @param {Object} categoryData بيانات الفئة الجديدة
   * @returns {Promise} وعد يحتوي على بيانات الفئة المنشأة
   */
  create: (categoryData) => api.post('/categories', categoryData),
  
  /**
   * تحديث فئة
   * @param {string} id معرف الفئة
   * @param {Object} categoryData بيانات الفئة المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الفئة المحدثة
   */
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  /**
   * حذف فئة
   * @param {string} id معرف الفئة
   * @returns {Promise} وعد يحتوي على استجابة حذف الفئة
   */
  delete: (id) => api.delete(`/categories/${id}`),
  
  /**
   * تغيير حالة الفئة
   * @param {string} id معرف الفئة
   * @param {boolean} isActive حالة الفئة
   * @returns {Promise} وعد يحتوي على بيانات الفئة المحدثة
   */
  toggleStatus: (id, isActive) => api.patch(`/categories/${id}/status`, { isActive }),
  
  /**
   * البحث عن فئات
   * @param {string} keyword كلمة البحث
   * @returns {Promise} وعد يحتوي على نتائج البحث
   */
  search: (keyword) => api.get('/categories/search', { params: { keyword } }),
  
  /**
   * الحصول على إحصائيات الفئات
   * @returns {Promise} وعد يحتوي على إحصائيات الفئات
   */
  getStats: () => api.get('/categories/stats')
};

// واجهة القياسات
export const measurementsAPI = {
  /**
   * الحصول على جميع القياسات
   * @returns {Promise} وعد يحتوي على قائمة القياسات
   */
  getAll: () => api.get('/measurements'),
  
  /**
   * الحصول على قياس محدد
   * @param {string} id معرف القياس
   * @returns {Promise} وعد يحتوي على بيانات القياس
   */
  getById: (id) => api.get(`/measurements/${id}`),
  
  /**
   * إنشاء قياس جديد
   * @param {Object} measurementData بيانات القياس الجديد
   * @returns {Promise} وعد يحتوي على بيانات القياس المنشأ
   */
  create: (measurementData) => api.post('/measurements', measurementData),
  
  /**
   * تحديث قياس
   * @param {string} id معرف القياس
   * @param {Object} measurementData بيانات القياس المحدثة
   * @returns {Promise} وعد يحتوي على بيانات القياس المحدثة
   */
  update: (id, measurementData) => api.put(`/measurements/${id}`, measurementData),
  
  /**
   * حذف قياس
   * @param {string} id معرف القياس
   * @returns {Promise} وعد يحتوي على استجابة حذف القياس
   */
  delete: (id) => api.delete(`/measurements/${id}`),
  
  /**
   * تعيين قياس كافتراضي
   * @param {string} id معرف القياس
   * @returns {Promise} وعد يحتوي على استجابة تعيين القياس كافتراضي
   */
  setDefault: (id) => api.put(`/measurements/${id}/default`)
};

// واجهة الإشعارات
export const notificationsAPI = {
  /**
   * الحصول على الإشعارات غير المقروءة
   * @returns {Promise} وعد يحتوي على الإشعارات غير المقروءة
   */
  getUnread: () => api.get('/notifications/unread'),
  
  /**
   * الحصول على جميع الإشعارات
   * @param {Object} params معلمات الاستعلام (page, pageSize)
   * @returns {Promise} وعد يحتوي على جميع الإشعارات
   */
  getAll: (params) => api.get('/notifications', { params }),
  
  /**
   * وضع علامة مقروء على إشعار
   * @param {string} id معرف الإشعار
   * @returns {Promise} وعد يحتوي على استجابة وضع علامة مقروء
   */
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  /**
   * وضع علامة مقروء على جميع الإشعارات
   * @returns {Promise} وعد يحتوي على استجابة وضع علامة مقروء على جميع الإشعارات
   */
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  /**
   * حذف إشعار
   * @param {string} id معرف الإشعار
   * @returns {Promise} وعد يحتوي على استجابة حذف الإشعار
   */
  delete: (id) => api.delete(`/notifications/${id}`)
};

// واجهة الطلبات
export const ordersAPI = {
  /**
   * إنشاء طلب جديد
   * @param {Object} orderData بيانات الطلب الجديد
   * @returns {Promise} وعد يحتوي على بيانات الطلب المنشأ
   */
  create: (orderData) => api.post('/orders', orderData),
  
  /**
   * الحصول على طلبات المستخدم الحالي
   * @param {Object} params معلمات الاستعلام (page, pageSize)
   * @returns {Promise} وعد يحتوي على طلبات المستخدم الحالي
   */
  getMyOrders: (params) => api.get('/orders', { params }),
  
  /**
   * الحصول على طلب محدد
   * @param {string} id معرف الطلب
   * @returns {Promise} وعد يحتوي على بيانات الطلب
   */
  getById: (id) => api.get(`/orders/${id}`),
  
  /**
   * إلغاء طلب
   * @param {string} id معرف الطلب
   * @param {Object} data بيانات الإلغاء (reason)
   * @returns {Promise} وعد يحتوي على استجابة إلغاء الطلب
   */
  cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
  
  /**
   * تقييم طلب
   * @param {string} id معرف الطلب
   * @param {Object} ratingData بيانات التقييم (rate, comment)
   * @returns {Promise} وعد يحتوي على استجابة تقييم الطلب
   */
  rate: (id, ratingData) => api.put(`/orders/${id}/rate`, ratingData),
  
  /**
   * الحصول على جميع الطلبات (للمسؤول)
   * @param {Object} params معلمات الاستعلام (status, orderNumber, userId, page, pageSize)
   * @returns {Promise} وعد يحتوي على جميع الطلبات
   */
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  
  /**
   * تحديث حالة الطلب (للمسؤول)
   * @param {string} id معرف الطلب
   * @param {Object} data بيانات تحديث الحالة (status, notes)
   * @returns {Promise} وعد يحتوي على بيانات الطلب المحدثة
   */
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data)
};

// واجهة الخدمات المهنية
export const servicesAPI = {
  /**
   * الحصول على جميع الخدمات المهنية
   * @param {Object} params معلمات الاستعلام (keyword, category, page, pageSize)
   * @returns {Promise} وعد يحتوي على جميع الخدمات المهنية
   */
  getAll: (params) => api.get('/professionalservices', { params }),
  
  /**
   * الحصول على خدماتي المهنية
   * @returns {Promise} وعد يحتوي على خدماتي المهنية
   */
  getMyServices: () => api.get('/professionalservices/myservices'),
  
  /**
   * الحصول على خدمة محددة
   * @param {string} id معرف الخدمة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة
   */
  getById: (id) => api.get(`/professionalservices/${id}`),
  
  /**
   * إنشاء خدمة مهنية جديدة
   * @param {Object} serviceData بيانات الخدمة الجديدة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة المنشأة
   */
  create: (serviceData) => api.post('/professionalservices', serviceData),
  
  /**
   * تحديث خدمة مهنية
   * @param {string} id معرف الخدمة
   * @param {Object} serviceData بيانات الخدمة المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة المحدثة
   */
  update: (id, serviceData) => api.put(`/professionalservices/${id}`, serviceData),
  
  /**
   * حذف خدمة مهنية
   * @param {string} id معرف الخدمة
   * @returns {Promise} وعد يحتوي على استج
   * export const servicesAPI = {
  /**
   * الحصول على جميع الخدمات المهنية
   * @param {Object} params معلمات الاستعلام (keyword, category, page, pageSize)
   * @returns {Promise} وعد يحتوي على جميع الخدمات المهنية
   */
  getAll: (params) => api.get('/professionalservices', { params }),
  
  /**
   * الحصول على خدماتي المهنية
   * @returns {Promise} وعد يحتوي على خدماتي المهنية
   */
  getMyServices: () => api.get('/professionalservices/myservices'),
  
  /**
   * الحصول على خدمة محددة
   * @param {string} id معرف الخدمة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة
   */
  getById: (id) => api.get(`/professionalservices/${id}`),
  
  /**
   * إنشاء خدمة مهنية جديدة
   * @param {Object} serviceData بيانات الخدمة الجديدة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة المنشأة
   */
  create: (serviceData) => api.post('/professionalservices', serviceData),
  
  /**
   * تحديث خدمة مهنية
   * @param {string} id معرف الخدمة
   * @param {Object} serviceData بيانات الخدمة المحدثة
   * @returns {Promise} وعد يحتوي على بيانات الخدمة المحدثة
   */
  update: (id, serviceData) => api.put(`/professionalservices/${id}`, serviceData),
  
  /**
   * حذف خدمة مهنية
   * @param {string} id معرف الخدمة
   * @returns {Promise} وعد يحتوي على استجابة حذف الخدمة
   */
  delete: (id) => api.delete(`/professionalservices/${id}`),
  
  /**
   * طلب خدمة مهنية
   * @param {string} id معرف الخدمة
   * @param {Object} requestData بيانات طلب الخدمة (details, preferredDate, budget)
   * @returns {Promise} وعد يحتوي على استجابة طلب الخدمة
   */
  requestService: (id, requestData) => api.post(`/professionalservices/${id}/request`, requestData),
  
  /**
   * تقييم خدمة
   * @param {string} id معرف الخدمة
   * @param {Object} reviewData بيانات التقييم (rating, comment)
   * @returns {Promise} وعد يحتوي على استجابة تقييم الخدمة
   */
  reviewService: (id, reviewData) => api.post(`/professionalservices/${id}/review`, reviewData)
};

// واجهة التحميل
export const uploadAPI = {
  /**
   * تحميل صورة واحدة
   * @param {FormData} formData بيانات الصورة
   * @returns {Promise} وعد يحتوي على استجابة تحميل الصورة
   */
  uploadImage: (formData) => api.post('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  /**
   * تحميل عدة صور
   * @param {FormData} formData بيانات الصور
   * @returns {Promise} وعد يحتوي على استجابة تحميل الصور
   */
  uploadMultiple: (formData) => api.post('/uploads/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  /**
   * تحميل مستند
   * @param {FormData} formData بيانات المستند
   * @returns {Promise} وعد يحتوي على استجابة تحميل المستند
   */
  uploadDocument: (formData) => api.post('/uploads/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  /**
   * حذف ملف
   * @param {string} filename اسم الملف
   * @returns {Promise} وعد يحتوي على استجابة حذف الملف
   */
  deleteFile: (filename) => api.delete(`/uploads/${filename}`),
  
  /**
   * الحصول على أنواع الملفات المدعومة
   * @returns {Promise} وعد يحتوي على أنواع الملفات المدعومة
   */
  getSupportedFileTypes: () => api.get('/uploads/supported-types')
};

// وظائف مساعدة
export const helpers = {
  /**
   * إعداد header Authorization
   * @param {string} token رمز المصادقة
   */
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  /**
   * الحصول على رمز المصادقة الحالي
   * @returns {string|null} رمز المصادقة أو null إذا لم يكن موجودًا
   */
  getAuthToken: () => localStorage.getItem('token'),
  
  /**
   * التحقق من حالة المصادقة
   * @returns {boolean} true إذا كان المستخدم مصادقًا، false إذا لم يكن كذلك
   */
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  /**
   * تنسيق رسالة خطأ
   * @param {Error} error كائن الخطأ
   * @returns {string} رسالة الخطأ المنسقة
   */
  formatErrorMessage: (error) => {
    if (error.userMessage) {
      return error.userMessage;
    }
    
    if (error.response && error.response.data) {
      return error.response.data.message || error.response.data.error || 'حدث خطأ غير متوقع';
    }
    
    return error.message || 'حدث خطأ غير متوقع';
  }
};

// تهيئة التوكن عند بدء التطبيق
const token = helpers.getAuthToken();
if (token) {
  helpers.setAuthToken(token);
}

export default api;