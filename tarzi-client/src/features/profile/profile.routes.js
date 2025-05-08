// src/features/profile/routes.js
import React from 'react';

// استيراد مكونات الصفحات مؤقتاً
const ProfilePage = () => <div>صفحة الملف الشخصي</div>;
const EditProfilePage = () => <div>صفحة تعديل الملف الشخصي</div>;

export const profileRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/edit", element: <EditProfilePage /> },
];

export default profileRoutes;