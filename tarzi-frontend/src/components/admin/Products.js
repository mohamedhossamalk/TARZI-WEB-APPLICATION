// src/components/Admin/Products.js
import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <h1>إدارة المنتجات</h1>
      <p>هذه الصفحة قيد الإنشاء...</p>
      <div>
        <Link to="/admin/products/new" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0d6efd', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '1rem'
        }}>
          إضافة منتج جديد
        </Link>
      </div>
    </div>
  );
};

export default Products;