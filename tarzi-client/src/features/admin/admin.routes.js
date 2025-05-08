// src/features/admin/routes.js
import React from 'react';
import DashboardPage from './pages/DashboardPage';
import ProductsAdminPage from './pages/ProductsAdminPage';
import CategoriesAdminPage from './pages/CategoriesAdminPage';
import OrdersAdminPage from './pages/OrdersAdminPage';
import UsersAdminPage from './pages/UsersAdminPage';
import SettingsAdminPage from './pages/SettingsAdminPage';

export const adminRoutes = [
  { path: "/admin", element: <DashboardPage /> },
  { path: "/admin/products", element: <ProductsAdminPage /> },
  { path: "/admin/categories", element: <CategoriesAdminPage /> },
  { path: "/admin/orders", element: <OrdersAdminPage /> },
  { path: "/admin/users", element: <UsersAdminPage /> },
  { path: "/admin/settings", element: <SettingsAdminPage /> },
];

export default adminRoutes;