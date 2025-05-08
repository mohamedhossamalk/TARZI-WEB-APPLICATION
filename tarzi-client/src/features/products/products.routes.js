// src/features/products/routes.js
import React from 'react';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HomePage from './pages/HomePage';
// سنقوم لاحقًا بإنشاء صفحة المفضلة

// تقسيم المسارات إلى عامة ومحمية
const productRoutes = {
  // المسارات العامة (لا تتطلب تسجيل دخول)
  public: [
    { path: "/products", element: <ProductsPage /> },
    { path: "/products/:id", element: <ProductDetailPage /> }
  ],
  
  // المسارات المحمية (تتطلب تسجيل دخول)
  protected: [
    // سنضيف مسار المفضلة لاحقًا
  ]
};

export default productRoutes;