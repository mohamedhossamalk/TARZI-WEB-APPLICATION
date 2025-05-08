// src/features/orders/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const OrdersPage = () => <div>صفحة الطلبات</div>;
const OrderDetailPage = () => <div>صفحة تفاصيل الطلب</div>;
const CheckoutPage = () => <div>صفحة الدفع</div>;

export const orderRoutes = [
  { path: "/orders", element: <OrdersPage /> },
  { path: "/orders/:id", element: <OrderDetailPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
];

export default orderRoutes;