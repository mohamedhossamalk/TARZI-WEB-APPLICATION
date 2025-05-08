// src/features/admin/services/adminService.js
import api from '../../../core/api/axios-config';
import endpoints from '../../../core/api/endpoints';

const adminService = {
  // إحصائيات لوحة التحكم
  getDashboardStats: async () => {
    try {
      const response = await api.get(endpoints.admin.getDashboardStats);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // إدارة المستخدمين
  getUsers: async (params = {}) => {
    try {
      const response = await api.get(endpoints.admin.getUsersList, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(endpoints.admin.updateUserStatus(id), status);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // إدارة المنتجات
  createProduct: async (productData) => {
    try {
      const response = await api.post(endpoints.admin.createProduct, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(endpoints.admin.updateProduct(id), productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(endpoints.admin.deleteProduct(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  toggleProductFeatured: async (id, isFeatured) => {
    try {
      const response = await api.patch(endpoints.admin.toggleFeatured(id), { isFeatured });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProductStatus: async (id, isActive) => {
    try {
      const response = await api.patch(endpoints.admin.updateProductStatus(id), { isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // إدارة الفئات
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(endpoints.admin.createCategory, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(endpoints.admin.updateCategory(id), categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(endpoints.admin.deleteCategory(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  toggleCategoryStatus: async (id, isActive) => {
    try {
      const response = await api.patch(endpoints.admin.toggleCategoryStatus(id), { isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // إدارة الطلبات
  getOrders: async (params = {}) => {
    try {
      const response = await api.get(endpoints.admin.getOrdersList, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateOrderStatus: async (id, status, notes) => {
    try {
      const response = await api.put(endpoints.admin.updateOrderStatus(id), { status, notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getOrderDetails: async (id) => {
    try {
      const response = await api.get(endpoints.admin.getOrderDetails(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // إدارة الإعدادات
  getSettings: async () => {
    try {
      const response = await api.get(endpoints.admin.getSettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put(endpoints.admin.updateSettings, settingsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default adminService;