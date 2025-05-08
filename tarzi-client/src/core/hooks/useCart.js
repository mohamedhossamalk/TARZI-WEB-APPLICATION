// src/core/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import cartService from '../../features/cart/services/cartService';
import { useAuth } from './useAuth';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // جلب محتويات السلة
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // قراءة السلة من التخزين المحلي إذا لم يكن المستخدم مسجلاً
      const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0}');
      setCart(localCart);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب السلة');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // جلب السلة عند تغير حالة تسجيل الدخول
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // إضافة منتج إلى السلة
  const addToCart = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        // إضافة المنتج للسلة المحلية
        const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0}');
        
        // التحقق إذا كان المنتج موجود بالفعل
        const existingItemIndex = localCart.items.findIndex(item => 
          item.productId === productData.productId && 
          item.fabricChoice === productData.fabricChoice && 
          item.colorChoice === productData.colorChoice &&
          item.measurementId === productData.measurementId
        );
        
        if (existingItemIndex > -1) {
          // زيادة الكمية إذا كان المنتج موجود
          localCart.items[existingItemIndex].quantity += productData.quantity;
        } else {
          // إضافة المنتج إذا لم يكن موجود
          const newItem = {
            _id: Date.now().toString(),
            ...productData
          };
          localCart.items.push(newItem);
        }
        
        // إعادة حساب الإجمالي
        updateLocalCartTotals(localCart);
          // حفظ السلة في التخزين المحلي
          localStorage.setItem('cart', JSON.stringify(localCart));
          setCart(localCart);
          setLoading(false);
          return localCart;
        }
  
        // إضافة المنتج للسلة عبر API إذا كان المستخدم مسجل
        const response = await cartService.addToCart(productData);
        setCart(response.data);
        return response.data;
      } catch (err) {
        setError('حدث خطأ أثناء إضافة المنتج للسلة');
        console.error('Error adding to cart:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    // تحديث كمية منتج في السلة
    const updateItemQuantity = async (itemId, quantity) => {
      try {
        setLoading(true);
        setError(null);
  
        if (!isAuthenticated) {
          // تعديل الكمية في السلة المحلية
          const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0}');
          const itemIndex = localCart.items.findIndex(item => item._id === itemId);
          
          if (itemIndex > -1) {
            localCart.items[itemIndex].quantity = quantity;
            updateLocalCartTotals(localCart);
            localStorage.setItem('cart', JSON.stringify(localCart));
            setCart(localCart);
            setLoading(false);
            return localCart;
          }
          
          throw new Error('المنتج غير موجود في السلة');
        }
  
        // تعديل الكمية عبر API إذا كان المستخدم مسجل
        const response = await cartService.updateItemQuantity(itemId, quantity);
        setCart(response.data);
        return response.data;
      } catch (err) {
        setError('حدث خطأ أثناء تحديث كمية المنتج');
        console.error('Error updating item quantity:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    // حذف منتج من السلة
    const removeItem = async (itemId) => {
      try {
        setLoading(true);
        setError(null);
  
        if (!isAuthenticated) {
          // حذف المنتج من السلة المحلية
          const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0}');
          const updatedItems = localCart.items.filter(item => item._id !== itemId);
          localCart.items = updatedItems;
          
          updateLocalCartTotals(localCart);
          localStorage.setItem('cart', JSON.stringify(localCart));
          setCart(localCart);
          setLoading(false);
          return localCart;
        }
  
        // حذف المنتج عبر API إذا كان المستخدم مسجل
        const response = await cartService.removeItem(itemId);
        setCart(response.data);
        return response.data;
      } catch (err) {
        setError('حدث خطأ أثناء حذف المنتج من السلة');
        console.error('Error removing item:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    // تطبيق كوبون خصم
    const applyCoupon = async (couponCode) => {
      try {
        setLoading(true);
        setError(null);
  
        if (!isAuthenticated) {
          // محاكاة تطبيق الكوبون للمستخدم غير المسجل
          // هذه محاكاة بسيطة، في الحالة الحقيقية يجب التحقق من الكوبون عبر API
          const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0}');
          
          // محاكاة بعض الكوبونات
          if (couponCode === 'WELCOME10') {
            localCart.discount = Math.round(localCart.subtotal * 0.1);
          } else if (couponCode === 'TARZI20') {
            localCart.discount = Math.round(localCart.subtotal * 0.2);
          } else {
            throw new Error('كوبون غير صالح');
          }
          
          updateLocalCartTotals(localCart);
          localStorage.setItem('cart', JSON.stringify(localCart));
          setCart(localCart);
          setLoading(false);
          return { success: true, message: 'تم تطبيق الكوبون بنجاح' };
        }
  
        // تطبيق الكوبون عبر API إذا كان المستخدم مسجل
        const response = await cartService.applyCoupon(couponCode);
        setCart(response.data.cart);
        return response.data;
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء تطبيق الكوبون');
        console.error('Error applying coupon:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    // مسح السلة
    const clearCart = async () => {
      try {
        setLoading(true);
  
        if (!isAuthenticated) {
          // مسح السلة المحلية
          const emptyCart = {"items":[],"subtotal":0,"shippingCost":0,"taxAmount":0,"discount":0,"totalPrice":0};
          localStorage.setItem('cart', JSON.stringify(emptyCart));
          setCart(emptyCart);
          setLoading(false);
          return emptyCart;
        }
  
        // مسح السلة عبر API إذا كان المستخدم مسجل
        const response = await cartService.clearCart();
        setCart(response.data);
        return response.data;
      } catch (err) {
        setError('حدث خطأ أثناء مسح السلة');
        console.error('Error clearing cart:', err);
      } finally {
        setLoading(false);
      }
    };
  
    // دالة مساعدة لتحديث إجماليات السلة المحلية
    const updateLocalCartTotals = (cart) => {
      // حساب المجموع الفرعي
      let subtotal = 0;
      cart.items.forEach(item => {
        subtotal += item.price * item.quantity;
      });
      cart.subtotal = subtotal;
      
      // حساب رسوم الشحن (مجانية للطلبات فوق 500 ريال)
      cart.shippingCost = subtotal > 500 ? 0 : 50;
      
      // حساب الضريبة (15%)
      cart.taxRate = 15;
      cart.taxAmount = Math.round((subtotal - cart.discount) * 0.15 * 100) / 100;
      
      // حساب الإجمالي
      cart.totalPrice = subtotal + cart.shippingCost + cart.taxAmount - cart.discount;
      
      // تقريب الأرقام
      cart.subtotal = Math.round(cart.subtotal * 100) / 100;
      cart.taxAmount = Math.round(cart.taxAmount * 100) / 100;
      cart.totalPrice = Math.round(cart.totalPrice * 100) / 100;
      
      return cart;
    };
  
    return {
      cart,
      loading,
      error,
      fetchCart,
      addToCart,
      updateItemQuantity,
      removeItem,
      applyCoupon,
      clearCart
    };
  };
  
  export default useCart;