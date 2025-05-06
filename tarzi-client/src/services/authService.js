import API from './api';

const AuthService = {
  login: (credentials) => {
    return API.post('/auth/login', credentials);
  },

  register: (userData) => {
    return API.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateProfile: (userData) => {
    return API.put('/users/profile', userData);
  },

  changePassword: (passwordData) => {
    return API.post('/auth/change-password', passwordData);
  },

  forgotPassword: (email) => {
    return API.post('/auth/forgot-password', { email });
  },

  resetPassword: (resetData) => {
    return API.post('/auth/reset-password', resetData);
  }
};

export default AuthService;