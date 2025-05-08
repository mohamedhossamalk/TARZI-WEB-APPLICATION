// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, helpers, setLogoutHandler } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // إعداد معالج تسجيل الخروج للاستخدام في interceptor
  useEffect(() => {
    setLogoutHandler(() => {
      setUser(null);
      setError(null);
    });
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (helpers.isAuthenticated()) {
        try {
          const response = await authAPI.getCurrentUser();
          // التعامل مع هياكل الاستجابة المختلفة
          setUser(response.data.user || response.data.data || response.data);
        } catch (err) {
          console.error('فشل تحميل الملف الشخصي:', err);
          // لا داعي لحذف التوكن أو تسجيل الخروج هنا
          // سيتم التعامل مع ذلك من خلال interceptor
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      if (process.env.NODE_ENV === 'development') {
        console.log('بدء محاولة تسجيل الدخول...', credentials.email);
      }
      
      const response = await authAPI.login(credentials);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('استجابة تسجيل الدخول:', response.data);
      }
      
      // التحقق من بنية الاستجابة وتخزين التوكن
      if (!response.data.token) {
        throw new Error('لم يتم استلام رمز المصادقة من الخادم');
      }
      
      // تخزين التوكن
      helpers.setAuthToken(response.data.token);
      
      // تخزين بيانات المستخدم
      setUser(response.data.user || response.data.data || response.data);
      
      return true;
    } catch (err) {
      console.error('خطأ تسجيل الدخول:', err);
      setError(helpers.formatErrorMessage(err));
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      if (process.env.NODE_ENV === 'development') {
        console.log('بدء محاولة التسجيل...', userData.email);
      }
      
      const response = await authAPI.register(userData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('استجابة التسجيل:', response.data);
      }
      
      // التحقق من بنية الاستجابة وتخزين التوكن
      if (!response.data.token) {
        throw new Error('لم يتم استلام رمز المصادقة من الخادم');
      }
      
      // تخزين التوكن
      helpers.setAuthToken(response.data.token);
      
      // تخزين بيانات المستخدم
      setUser(response.data.user || response.data.data || response.data);
      
      return true;
    } catch (err) {
      console.error('خطأ التسجيل:', err);
      setError(helpers.formatErrorMessage(err));
      return false;
    }
  };

  const logout = () => {
    helpers.setAuthToken(null);
    setUser(null);
    setError(null);
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authAPI.forgotPassword({ email });
      return { 
        success: true, 
        message: response.data.message || 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' 
      };
    } catch (err) {
      const errorMsg = helpers.formatErrorMessage(err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const resetPassword = async (passwordData) => {
    try {
      setError(null);
      const response = await authAPI.resetPassword(passwordData);
      return { 
        success: true, 
        message: response.data.message || 'تم إعادة تعيين كلمة المرور بنجاح' 
      };
    } catch (err) {
      const errorMsg = helpers.formatErrorMessage(err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user || response.data.data || response.data);
      return { 
        success: true, 
        message: 'تم تحديث الملف الشخصي بنجاح' 
      };
    } catch (err) {
      const errorMsg = helpers.formatErrorMessage(err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await authAPI.changePassword(passwordData);
      return { 
        success: true, 
        message: response.data.message || 'تم تغيير كلمة المرور بنجاح' 
      };
    } catch (err) {
      const errorMsg = helpers.formatErrorMessage(err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isProfessional: user?.role === 'professional'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }
  return context;
};
