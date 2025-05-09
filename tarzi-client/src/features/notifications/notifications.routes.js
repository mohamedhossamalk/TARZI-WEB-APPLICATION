// src/features/notifications/routes.js
import React from 'react';
import NotificationsPage from './pages/NotificationsPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';

const notificationRoutes = [
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/notifications/settings", element: <NotificationSettingsPage /> }
];

export default notificationRoutes;