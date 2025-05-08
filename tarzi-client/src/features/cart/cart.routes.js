// src/features/cart/routes.js
import React from 'react';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

const cartRoutes = [
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> }
];

export default cartRoutes;