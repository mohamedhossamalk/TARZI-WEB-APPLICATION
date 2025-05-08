// src/features/services/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const ServicesPage = () => <div>صفحة الخدمات</div>;
const ServiceDetailPage = () => <div>صفحة تفاصيل الخدمة</div>;
const MyServicesPage = () => <div>صفحة خدماتي</div>;

export const serviceRoutes = {
  public: [
    { path: "/services", element: <ServicesPage /> },
    { path: "/services/:id", element: <ServiceDetailPage /> },
  ],
  professional: [
    { path: "/my-services", element: <MyServicesPage /> },
  ]
};

export default serviceRoutes;