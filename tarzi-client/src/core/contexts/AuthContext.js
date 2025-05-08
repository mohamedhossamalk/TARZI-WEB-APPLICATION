// src/core/contexts/AuthContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios-config';

// إنشاء السياق
export const AuthContext = createContext(); // تصدير AuthContext

// دالة هوك للوصول إلى سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('يجب أن يستخدم useAuth داخل AuthProvider');
  }
  return context;
};

// مزود السياق للمصادقة
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // دالة تسجيل الدخول
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      // في بيئة التطوير، نقوم بمحاكاة تسجيل الدخول بنجاح
      // في الإنتاج، ستقوم بالاتصال بـ API
      
      // محاكاة استجابة API
      const mockResponse = {
        success: true,
        token: 'mock-token-123456',
        user: {
          _id: '1',
          username: 'مستخدم تجريبي',
          email: credentials.email,
          role: 'user'
        }
      };
      
      // حفظ بيانات المستخدم في التخزين المحلي
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // تحديث الحالة
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      // رسالة نجاح
      toast.success('تم تسجيل الدخول بنجاح');
      
      return mockResponse.user;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      toast.error('فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة تسجيل الخروج
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  }, [navigate]);

  // دالة التحقق من حالة المصادقة
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      // في بيئة التطوير، نقوم بمحاكاة التحقق من الجلسة
      // في الإنتاج، ستقوم بالاتصال بـ API
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // إذا لم يتم العثور على بيانات المستخدم، قم بتسجيل الخروج
        logout();
      }
    } catch (error) {
      console.error('خطأ في التحقق من حالة المصادقة:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // القيم التي سيتم توفيرها من خلال السياق
  const value = {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isProfessional: user?.role === 'professional',
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

