// src/features/products/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const ProductsPage = () => <div>صفحة المنتجات</div>;
const ProductDetailPage = () => <div>صفحة تفاصيل المنتج</div>;
const HomePage = () => <div>الصفحة الرئيسية</div>;

export const productRoutes = {
  public: [
    { path: "/products", element: <ProductsPage /> },
    { path: "/products/:id", element: <ProductDetailPage /> },
  ],
  protected: []
};

export default productRoutes;