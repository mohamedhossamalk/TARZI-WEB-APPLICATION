// src/features/products/services/productService.js
import api from '../../../core/api/axios-config';
import endpoints from '../../../core/api/endpoints';

const productService = {
  // جلب جميع المنتجات
  getProducts: async (params = {}) => {
    try {
      const response = await api.get(endpoints.products.getAll, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // جلب منتج محدد
  getProductById: async (id) => {
    try {
      const response = await api.get(endpoints.products.getById(id));
      return response.data.product;
    } catch (error) {
      throw error;
    }
  },
  
  // جلب المنتجات المميزة
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get(endpoints.products.getFeatured, {
        params: { limit }
      });
      return response.data.products;
    } catch (error) {
      throw error;
    }
  },
  
  // جلب منتجات حسب الفئة
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await api.get(endpoints.products.getAll, {
        params: { 
          category: categoryId,
          ...params 
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // البحث عن منتجات
  searchProducts: async (keyword, params = {}) => {
    try {
      const response = await api.get(endpoints.products.getAll, {
        params: { 
          keyword,
          ...params 
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;