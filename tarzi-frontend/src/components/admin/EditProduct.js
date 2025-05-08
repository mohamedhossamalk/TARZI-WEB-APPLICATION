// src/components/Admin/EditProduct.js
import React from 'react';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <h1>تعديل المنتج</h1>
      <p>معرف المنتج: {id}</p>
      <p>هذه الصفحة قيد الإنشاء...</p>
    </div>
  );
};

export default EditProduct;