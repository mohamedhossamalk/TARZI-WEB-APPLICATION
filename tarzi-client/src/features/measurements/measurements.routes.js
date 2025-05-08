// قم بإنشاء ملف جديد في المسار:
// src/features/measurements/measurements.routes.js

import React from 'react';
import MeasurementsPage from './pages/MeasurementsPage';
import AddMeasurementPage from './pages/AddMeasurementPage';

export const measurementRoutes = [
  { path: "/measurements", element: <MeasurementsPage /> },
  { path: "/measurements/add", element: <AddMeasurementPage /> },
];

export default measurementRoutes;