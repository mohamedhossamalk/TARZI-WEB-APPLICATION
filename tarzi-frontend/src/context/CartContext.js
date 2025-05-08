// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // تحميل السلة من التخزين المحلي عند بداية التطبيق
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('خطأ في قراءة بيانات السلة من التخزين المحلي:', error);
        setCartItems([]);
      }
    }
  }, []);

  // تحديث عدد العناصر والإجمالي عند تغيير عناصر السلة
  useEffect(() => {
    // حساب إجمالي العناصر
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);

    // حساب إجمالي السعر
    const total = cartItems.reduce((sum, item) => {
      // حساب السعر بعد الخصم إن وجد
      const priceAfterDiscount = item.discount 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      
      return sum + priceAfterDiscount * item.quantity;
    }, 0);
    
    setCartTotal(total);

    // حفظ السلة في التخزين المحلي
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // إضافة منتج للسلة
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      
      if (existingItemIndex !== -1) {
        // إذا كان المنتج موجودًا بالفعل، زيادة الكمية
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // إذا لم يكن المنتج موجودًا، إضافته بكمية 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // تحديث كمية منتج في السلة
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // حذف منتج من السلة
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // تفريغ السلة
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // التحقق ما إذا كان المنتج موجوداً في السلة
  const isItemInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  // القيمة التي سيتم توفيرها للمستخدمين
  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isItemInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart يجب استخدامه داخل CartProvider');
  }
  return context;
};