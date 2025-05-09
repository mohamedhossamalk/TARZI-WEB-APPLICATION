// src/features/services/routes.js
import React from 'react';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import MyServicesPage from './pages/MyServicesPage';
import AddServicePage from './pages/AddServicePage';
import EditServicePage from './pages/EditServicePage';

// الخدمات المتاحة للجميع والخاصة بالمحترفين
const serviceRoutes = {
  public: [
    { path: "/services", element: <ServicesPage /> },
    { path: "/services/:id", element: <ServiceDetailPage /> }
  ],
  professional: [
    { path: "/services/manage", element: <MyServicesPage /> },
    { path: "/services/new", element: <AddServicePage /> },
    { path: "/services/edit/:id", element: <EditServicePage /> }
  ]
};

export default serviceRoutes;