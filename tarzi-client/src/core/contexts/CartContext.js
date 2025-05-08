// src/core/contexts/CartContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // استرجاع عناصر السلة من التخزين المحلي عند التحميل
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('خطأ في تحميل السلة من التخزين المحلي:', e);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setLoading(false);
  }, []);

  // حفظ السلة في التخزين المحلي عند التغيير
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // إضافة منتج إلى السلة
  const addToCart = useCallback((product, quantity = 1, fabricChoice = null, colorChoice = null, measurementId = null) => {
    setCartItems(prevItems => {
      // التحقق من وجود المنتج في السلة بالفعل مع نفس الخيارات
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.productId === product._id && 
          item.fabricChoice === fabricChoice && 
          item.colorChoice === colorChoice &&
          item.measurementId === measurementId
      );
      
      if (existingItemIndex !== -1) {
        // تحديث الكمية إذا كان المنتج موجوداً بالفعل
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success('تم تحديث الكمية في السلة');
        return updatedItems;
      } else {
        // إضافة المنتج الجديد
        toast.success('تمت إضافة المنتج إلى السلة');
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
            price: product.price,
            quantity,
            fabricChoice,
            colorChoice,
            measurementId
          }
        ];
      }
    });
  }, []);

  // تحديث كمية منتج في السلة
  const updateQuantity = useCallback((itemIndex, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[itemIndex].quantity = newQuantity;
      return updatedItems;
    });
  }, []);

  // إزالة منتج من السلة
  const removeFromCart = useCallback((itemIndex) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(itemIndex, 1);
      toast.info('تمت إزالة المنتج من السلة');
      return updatedItems;
    });
  }, []);

  // تفريغ السلة
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info('تم تفريغ السلة');
  }, []);

  // حساب المجموع الفرعي للسلة
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // عدد العناصر في السلة
  const itemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};