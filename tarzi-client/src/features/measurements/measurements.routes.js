// src/features/measurements/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const MeasurementsPage = () => <div>صفحة المقاسات</div>;
const AddMeasurementPage = () => <div>صفحة إضافة مقاس</div>;

export const measurementRoutes = [
  { path: "/measurements", element: <MeasurementsPage /> },
  { path: "/measurements/add", element: <AddMeasurementPage /> },
];

export default measurementRoutes;