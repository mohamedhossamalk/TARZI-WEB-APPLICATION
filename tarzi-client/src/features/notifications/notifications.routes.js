// src/features/notifications/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const NotificationsPage = () => <div>صفحة الإشعارات</div>;

export const notificationRoutes = [
  { path: "/notifications", element: <NotificationsPage /> },
];

export default notificationRoutes;