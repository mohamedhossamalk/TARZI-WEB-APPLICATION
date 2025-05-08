// src/core/api/endpoints.js
const endpoints = {
  // نقاط نهاية المصادقة
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    forgotPassword: '/auth/forgotpassword',
    resetPassword: '/auth/resetpassword',
    changePassword: '/auth/changepassword',
    updateProfile: '/auth/updateprofile',
  },

  // نقاط نهاية المنتجات
  products: {
    getAll: '/products',
    getById: (id) => `/products/${id}`,
    getFeatured: '/products/featured',
    search: '/products/search',
  },

  // نقاط نهاية الفئات
  categories: {
    getAll: '/categories',
    getById: (id) => `/categories/${id}`,
    getFeatured: '/categories/featured',
  },

  // نقاط نهاية الطلبات
  orders: {
    create: '/orders',
    getAll: '/orders',
    getById: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
    rate: (id) => `/orders/${id}/rate`,
  },

  // نقاط نهاية المقاسات
  measurements: {
    getAll: '/measurements',
    getById: (id) => `/measurements/${id}`,
    create: '/measurements',
    update: (id) => `/measurements/${id}`,
    delete: (id) => `/measurements/${id}`,
    setDefault: (id) => `/measurements/${id}/default`,
  },

  // نقاط نهاية الإشعارات
  notifications: {
    getUnread: '/notifications/unread',
    getAll: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
  },

  // نقاط نهاية المستخدمين
  users: {
    profile: '/users/profile',
    password: '/users/password',
    addresses: '/users/addresses',
  },

  // نقاط نهاية الخدمات المهنية
  services: {
    getAll: '/professionalservices',
    getById: (id) => `/professionalservices/${id}`,
    getMyServices: '/professionalservices/myservices',
    create: '/professionalservices',
    update: (id) => `/professionalservices/${id}`,
    delete: (id) => `/professionalservices/${id}`,
    request: (id) => `/professionalservices/${id}/request`,
    review: (id) => `/professionalservices/${id}/review`,
  },

  // نقاط نهاية رفع الملفات
  uploads: {
    uploadImage: '/uploads/image',
    uploadMultipleImages: '/uploads/images',
    deleteFile: (filename) => `/uploads/${filename}`,
  },

  // نقاط نهاية لوحة التحكم (المسؤول)
  admin: {
    // إحصائيات
    getDashboardStats: '/admin/dashboard',
    
    // المستخدمين
    getUsersList: '/admin/users',
    updateUserStatus: (id) => `/admin/users/${id}/status`,
    
    // المنتجات
    createProduct: '/admin/products',
    updateProduct: (id) => `/admin/products/${id}`,
    deleteProduct: (id) => `/admin/products/${id}`,
    toggleFeatured: (id) => `/admin/products/${id}/featured`,
    updateProductStatus: (id) => `/admin/products/${id}/status`,
    
    // الفئات
    createCategory: '/admin/categories',
    updateCategory: (id) => `/admin/categories/${id}`,
    deleteCategory: (id) => `/admin/categories/${id}`,
    toggleCategoryStatus: (id) => `/admin/categories/${id}/status`,
    
    // الطلبات
    getOrdersList: '/admin/orders',
    updateOrderStatus: (id) => `/admin/orders/${id}/status`,
    getOrderDetails: (id) => `/admin/orders/${id}`,
    
    // الإعدادات
    getSettings: '/admin/settings',
    updateSettings: '/admin/settings',
  },
};

export default endpoints;