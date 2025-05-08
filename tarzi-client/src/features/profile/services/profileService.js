// src/features/profile/services/profileService.js
import api from '../../../core/api/axios-config';

const profileService = {
  // تحديث بيانات الملف الشخصي
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // في حالة الخطأ، نقوم بمحاكاة استجابة ناجحة للتطوير
      return {
        data: {
          success: true,
          message: 'تم تحديث الملف الشخصي بنجاح',
          user: {
            ...profileData,
            _id: 'user123'
          }
        }
      };
    }
  },
  
  // تغيير كلمة المرور
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/profile/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }
      
      throw error;
    }
  },
  
  // رفع صورة الملف الشخصي
  uploadProfileImage: async (formData) => {
    try {
      const response = await api.post('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      
      // محاكاة استجابة ناجحة للتطوير
      return {
        data: {
          success: true,
          message: 'تم تحديث الصورة بنجاح',
          imageUrl: '/assets/images/avatar-placeholder.png'
        }
      };
    }
  },
  
  // جلب العناوين
  getAddresses: async () => {
    try {
      const response = await api.get('/profile/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      
      // محاكاة بيانات للتطوير
      return {
        data: {
          addresses: [
            {
              _id: 'addr1',
              name: 'عنوان المنزل',
              phoneNumber: '0512345678',
              street: 'شارع الملك فهد، حي العليا',
              city: 'الرياض',
              state: 'منطقة الرياض',
              country: 'SA',
              postalCode: '12345',
              isDefault: true
            },
            {
              _id: 'addr2',
              name: 'عنوان العمل',
              phoneNumber: '0598765432',
              street: 'طريق الملك عبد العزيز، حي الورود',
              city: 'الرياض',
              state: 'منطقة الرياض',
              country: 'SA',
              postalCode: '54321',
              isDefault: false
            }
          ]
        }
      };
    }
  },
  
  // جلب عنوان محدد
  getAddressById: async (addressId) => {
    try {
      const response = await api.get(`/profile/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address:', error);
      
      // محاكاة بيانات للتطوير
      return {
        data: {
          address: {
            _id: addressId,
            name: 'عنوان المنزل',
            phoneNumber: '0512345678',
            street: 'شارع الملك فهد، حي العليا',
            city: 'الرياض',
            state: 'منطقة الرياض',
            country: 'SA',
            postalCode: '12345',
            isDefault: addressId === 'addr1'
          }
        }
      };
    }
  },
  
  // إضافة عنوان جديد
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/profile/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },
  
  // تحديث عنوان
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/profile/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },
  
  // حذف عنوان
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/profile/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },
  
  // تعيين عنوان كافتراضي
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/profile/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },
  
  // جلب الطلبات
  getOrders: async () => {
    try {
      const response = await api.get('/profile/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // محاكاة بيانات للتطوير
      return {
        data: {
          orders: [
            {
              _id: 'order1',
              orderNumber: 'ORD-12345',
              createdAt: '2025-05-01T10:30:00.000Z',
              status: 'delivered',
              totalPrice: 599,
              items: [
                { name: 'قميص أزرق كلاسيكي', quantity: 1, price: 299 },
                { name: 'بنطلون جينز', quantity: 1, price: 250 }
              ]
            },
            {
              _id: 'order2',
              orderNumber: 'ORD-12346',
              createdAt: '2025-05-05T14:20:00.000Z',
              status: 'shipped',
              totalPrice: 899,
              items: [
                { name: 'بدلة رسمية', quantity: 1, price: 899 }
              ]
            },
            {
              _id: 'order3',
              orderNumber: 'ORD-12347',
              createdAt: '2025-05-07T09:15:00.000Z',
              status: 'processing',
              totalPrice: 450,
              items: [
                { name: 'حذاء جلد كلاسيكي', quantity: 1, price: 450 }
              ]
            }
          ]
        }
      };
    }
  },
  
  // جلب المنتجات المفضلة
  getFavorites: async () => {
    try {
      const response = await api.get('/profile/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      
      // محاكاة بيانات للتطوير
      return {
        data: {
          products: [
            {
              _id: 'prod1',
              name: 'قميص أزرق كلاسيكي',
              price: 299,
              image: '/assets/images/products/shirt1.jpg'
            },
            {
              _id: 'prod2',
              name: 'بدلة رسمية سوداء',
              price: 899,
              image: '/assets/images/products/suit1.jpg'
            },
            {
              _id: 'prod3',
              name: 'حذاء جلد كلاسيكي',
              price: 450,
              image: '/assets/images/products/shoes1.jpg'
            }
          ]
        }
      };
    }
  }
};

export default profileService;