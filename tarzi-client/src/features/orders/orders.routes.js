// src/features/orders/routes.js
import React from 'react';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

const orderRoutes = [
  { path: "/orders", element: <OrdersPage /> },
  { path: "/orders/:id", element: <OrderDetailPage /> },
  { path: "/orders/:id/track", element: <OrderTrackingPage /> }
];

export default orderRoutes;