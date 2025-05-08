// src/features/profile/routes.js
import React from 'react';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AddressesPage from './pages/AddressesPage';
import AddAddressPage from './pages/AddAddressPage';
import EditAddressPage from './pages/EditAddressPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

const profileRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/edit", element: <EditProfilePage /> },
  { path: "/profile/addresses", element: <AddressesPage /> },
  { path: "/profile/addresses/add", element: <AddAddressPage /> },
  { path: "/profile/addresses/edit/:id", element: <EditAddressPage /> },
  { path: "/profile/change-password", element: <ChangePasswordPage /> }
];

export default profileRoutes;