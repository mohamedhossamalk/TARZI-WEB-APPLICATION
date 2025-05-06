import API from './api';

const CategoryService = {
  getCategories: () => {
    return API.get('/categories');
  },

  getCategoryById: (id) => {
    return API.get(`/categories/${id}`);
  },

  // Admin operations
  createCategory: (categoryData) => {
    return API.post('/categories', categoryData);
  },

  updateCategory: (id, categoryData) => {
    return API.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: (id) => {
    return API.delete(`/categories/${id}`);
  }
};

export default CategoryService;