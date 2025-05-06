import AuthService from '../../services/authService';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from '../../services/api';

// Action Types
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE';

// Login Action
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });
  
  try {
    const response = await AuthService.login(credentials);
    const { token } = response.data;
    
    // Decode token to get user data
    const user = jwt_decode(token);
    
    // Store in localStorage and set auth token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token); // استخدام الدالة الجديدة
    
    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: { user, token }
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: AUTH_LOGIN_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
    });
    throw error;
  }
};

// Register Action
export const register = (userData) => async (dispatch) => {
  dispatch({ type: AUTH_REGISTER_REQUEST });
  
  try {
    const response = await AuthService.register(userData);
    dispatch({
      type: AUTH_REGISTER_SUCCESS
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: AUTH_REGISTER_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء التسجيل'
    });
    throw error;
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  AuthService.logout();
  setAuthToken(null); // إلغاء التوكن
  dispatch({ type: AUTH_LOGOUT });
};

// Check Auth Status
export const checkAuthStatus = () => (dispatch) => {
  const user = AuthService.getCurrentUser();
  const token = localStorage.getItem('token');
  
  if (user && token) {
    // Check if token is expired
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expired, logout user
        dispatch(logout());
      } else {
        // Token still valid
        setAuthToken(token); // تعيين التوكن للطلبات
        dispatch({
          type: AUTH_LOGIN_SUCCESS,
          payload: { user, token }
        });
      }
    } catch (error) {
      // Invalid token format, logout user
      dispatch(logout());
    }
  }
};

// Set Manual Auth (للتطوير)
export const setManualAuth = (user, token) => (dispatch) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setAuthToken(token);
  
  dispatch({
    type: AUTH_LOGIN_SUCCESS,
    payload: { user, token }
  });
};