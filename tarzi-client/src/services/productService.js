import API from './api';

const ProductService = {
  getProducts: (filters = {}) => {
    return API.get('/products', { params: filters });
  },

  getProductById: (id) => {
    return API.get(`/products/${id}`);
  },

  getFeaturedProducts: () => {
    return API.get('/products/featured');
  },

  getProductsByCategory: (categoryId) => {
    return API.get(`/products/category/${categoryId}`);
  },

  // Admin operations
  createProduct: (productData) => {
    return API.post('/products', productData);
  },

  updateProduct: (id, productData) => {
    return API.put(`/products/${id}`, productData);
  },

  deleteProduct: (id) => {
    return API.delete(`/products/${id}`);
  },

  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return API.post('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default ProductService;