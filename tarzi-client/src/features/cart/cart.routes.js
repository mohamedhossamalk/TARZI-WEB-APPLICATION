// src/features/cart/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const CartPage = () => <div>صفحة سلة التسوق</div>;

export const cartRoutes = [
  { path: "/cart", element: <CartPage /> },
];

export default cartRoutes;