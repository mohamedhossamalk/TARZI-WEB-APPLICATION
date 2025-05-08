// src/features/cart/services/cartService.js
import api from '../../../core/api/axios-config';

const cartService = {
  // الحصول على محتويات السلة
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      
      // محاكاة استجابة API في حالة الفشل
      return {
        data: {
          items: [
            {
              _id: '1',
              productId: '1',
              name: 'قميص أزرق كلاسيكي',
              price: 299,
              quantity: 1,
              image: '/assets/images/products/shirt1.jpg',
              fabricChoice: 'قطن',
              colorChoice: 'أزرق'
            },
            {
              _id: '2',
              productId: '3',
              name: 'بنطلون جينز أزرق',
              price: 199,
              quantity: 2,
              image: '/assets/images/products/jeans1.jpg'
            }
          ],
          subtotal: 697,
          shippingCost: 50,
          taxRate: 15,
          taxAmount: 104.55,
          discount: 0,
          totalPrice: 851.55
        }
      };
    }
  },
  
  // إضافة منتج إلى السلة
  addToCart: async (productData) => {
    try {
      const response = await api.post('/cart', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  
  // تحديث كمية منتج في السلة
  updateItemQuantity: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  },
  
  // حذف منتج من السلة
  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },
  
  // تطبيق كوبون خصم
  applyCoupon: async (couponCode) => {
    try {
      const response = await api.post('/cart/apply-coupon', { couponCode });
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },
  
  // إتمام عملية الشراء
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },
  
  // مسح السلة
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService;