// src/features/admin/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const DashboardPage = () => <div>لوحة التحكم</div>;
const ProductsAdminPage = () => <div>إدارة المنتجات</div>;
const CategoriesAdminPage = () => <div>إدارة الفئات</div>;
const OrdersAdminPage = () => <div>إدارة الطلبات</div>;
const UsersAdminPage = () => <div>إدارة المستخدمين</div>;
const SettingsAdminPage = () => <div>إعدادات النظام</div>;

export const adminRoutes = [
  { path: "/admin", element: <DashboardPage /> },
  { path: "/admin/products", element: <ProductsAdminPage /> },
  { path: "/admin/categories", element: <CategoriesAdminPage /> },
  { path: "/admin/orders", element: <OrdersAdminPage /> },
  { path: "/admin/users", element: <UsersAdminPage /> },
  { path: "/admin/settings", element: <SettingsAdminPage /> },
];

export default adminRoutes;