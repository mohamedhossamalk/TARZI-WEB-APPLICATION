// src/features/services/services/professionalService.js
import api from '../../../core/api/axios-config';

const professionalService = {
  // جلب قائمة الخدمات
  getServices: async (params = {}) => {
    try {
      const response = await api.get('/services', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          services: [
            {
              _id: 'service1',
              title: 'خياطة وتفصيل البدل الرجالية',
              description: 'خدمة احترافية لخياطة وتفصيل البدل الرجالية بأعلى جودة ومقاسات دقيقة',
              price: 799,
              deliveryTime: 7,
              rating: 4.8,
              reviewsCount: 127,
              images: [
                '/assets/images/services/tailor1.jpg',
                '/assets/images/services/tailor2.jpg'
              ],
              professional: {
                _id: 'pro1',
                name: 'أحمد محمد',
                avatar: '/assets/images/avatars/pro1.jpg',
                rating: 4.9
              },
              categoryId: 'cat1',
              category: {
                id: 'cat1',
                name: 'خياطة رجالية'
              },
              features: [
                'تصميم حسب المقاس',
                'قماش عالي الجودة',
                'تعديلات مجانية'
              ],
              isActive: true
            },
            {
              _id: 'service2',
              title: 'تفصيل فساتين سهرة',
              description: 'تفصيل فساتين سهرة حسب الطلب بأحدث الموديلات وأرقى الأقمشة',
              price: 1200,
              deliveryTime: 14,
              rating: 4.7,
              reviewsCount: 84,
              images: [
                '/assets/images/services/dress1.jpg',
                '/assets/images/services/dress2.jpg'
              ],
              professional: {
                _id: 'pro2',
                name: 'سارة أحمد',
                avatar: '/assets/images/avatars/pro2.jpg',
                rating: 4.8
              },
              categoryId: 'cat2',
              category: {
                id: 'cat2',
                name: 'خياطة نسائية'
              },
              features: [
                'تصميم حسب الطلب',
                'أقمشة مستوردة',
                'تطريز يدوي'
              ],
              isActive: true
            },
            {
              _id: 'service3',
              title: 'تعديل وإصلاح الملابس',
              description: 'خدمة تعديل وإصلاح مختلف أنواع الملابس الرجالية والنسائية',
              price: 150,
              deliveryTime: 3,
              rating: 4.5,
              reviewsCount: 213,
              images: [
                '/assets/images/services/alteration1.jpg'
              ],
              professional: {
                _id: 'pro3',
                name: 'محمد علي',
                avatar: '/assets/images/avatars/pro3.jpg',
                rating: 4.6
              },
              categoryId: 'cat3',
              category: {
                id: 'cat3',
                name: 'تعديلات وإصلاحات'
              },
              features: [
                'خدمة سريعة',
                'جودة عالية',
                'أسعار معقولة'
              ],
              isActive: true
            }
          ]
        }
      };
    }
  },

  // جلب تفاصيل خدمة محددة
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          service: {
            _id: id,
            title: 'خياطة وتفصيل البدل الرجالية',
            description: 'خدمة احترافية لخياطة وتفصيل البدل الرجالية بأعلى جودة ومقاسات دقيقة. تشمل الخدمة اختيار القماش، القياسات الدقيقة، والتعديلات اللازمة لضمان الحصول على بدلة مثالية تناسب شخصيتك ومناسبتك.',
            price: 799,
            deliveryTime: 7,
            rating: 4.8,
            reviewsCount: 127,
            images: [
              '/assets/images/services/tailor1.jpg',
              '/assets/images/services/tailor2.jpg',
              '/assets/images/services/tailor3.jpg'
            ],
            professional: {
              _id: 'pro1',
              name: 'أحمد محمد',
              avatar: '/assets/images/avatars/pro1.jpg',
              bio: 'خياط محترف بخبرة أكثر من 15 عاماً في مجال خياطة البدل والأزياء الرجالية الراقية',
              rating: 4.9,
              reviewsCount: 217
            },
            categoryId: 'cat1',
            category: {
              id: 'cat1',
              name: 'خياطة رجالية'
            },
            features: [
              'تصميم حسب المقاس',
              'قماش عالي الجودة',
              'تعديلات مجانية',
              'خبرة أكثر من 15 عاماً',
              'ضمان الرضا'
            ],
            isActive: true,
            createdAt: '2023-05-01T10:30:00.000Z'
          }
        }
      };
    }
  },

  // جلب فئات الخدمات
  getServiceCategories: async () => {
    try {
      const response = await api.get('/services/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching service categories:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          categories: [
            { id: 'cat1', name: 'خياطة رجالية' },
            { id: 'cat2', name: 'خياطة نسائية' },
            { id: 'cat3', name: 'تعديلات وإصلاحات' },
            { id: 'cat4', name: 'تصميم أزياء' },
            { id: 'cat5', name: 'خياطة ملابس أطفال' },
            { id: 'cat6', name: 'أعمال تطريز' }
          ]
        }
      };
    }
  },

  // جلب تقييمات ومراجعات الخدمة
  getServiceReviews: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for service ${serviceId}:`, error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          reviews: [
            {
              _id: 'rev1',
              rating: 5,
              comment: 'خدمة ممتازة وجودة عالية. سعيد جداً بالبدلة التي حصلت عليها وسأتعامل معهم مرة أخرى بالتأكيد',
              createdAt: '2023-06-15T14:30:00.000Z',
              user: {
                _id: 'user1',
                name: 'خالد العمري',
                avatar: '/assets/images/avatars/user1.jpg'
              }
            },
            {
              _id: 'rev2',
              rating: 4,
              comment: 'التفصيل ممتاز والقماش عالي الجودة. التسليم تأخر يومين عن الموعد المحدد لكن النتيجة النهائية رائعة',
              createdAt: '2023-05-22T09:15:00.000Z',
              user: {
                _id: 'user2',
                name: 'عمر السيد',
                avatar: '/assets/images/avatars/user2.jpg'
              }
            },
            {
              _id: 'rev3',
              rating: 5,
              comment: 'التعامل احترافي والنتيجة أكثر من رائعة. سعيد جداً بالتعامل معهم وأنصح الجميع بتجربة خدماتهم',
              createdAt: '2023-04-10T16:45:00.000Z',
              user: {
                _id: 'user3',
                name: 'فيصل المحمد',
                avatar: '/assets/images/avatars/user3.jpg'
              }
            }
          ]
        }
      };
    }
  },

  // إضافة خدمة جديدة
  addService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },

  // تحديث خدمة موجودة
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${serviceId}:`, error);
      throw error;
    }
  },

  // تحديث حالة الخدمة (نشطة/غير نشطة)
  updateServiceStatus: async (serviceId, statusData) => {
    try {
      const response = await api.patch(`/services/${serviceId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${serviceId} status:`, error);
      throw error;
    }
  },

  // حذف خدمة
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service ${serviceId}:`, error);
      throw error;
    }
  },

  // جلب الخدمات الخاصة بالمحترف المسجل دخوله
  getMyServices: async () => {
    try {
      const response = await api.get('/services/my-services');
      return response.data;
    } catch (error) {
      console.error('Error fetching my services:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          services: [
            {
              _id: 'service1',
              title: 'خياطة وتفصيل البدل الرجالية',
              description: 'خدمة احترافية لخياطة وتفصيل البدل الرجالية بأعلى جودة ومقاسات دقيقة',
              price: 799,
              deliveryTime: 7,
              rating: 4.8,
              reviewsCount: 127,
              images: [
                '/assets/images/services/tailor1.jpg'
              ],
              categoryId: 'cat1',
              isActive: true
            },
            {
              _id: 'service4',
              title: 'تفصيل القمصان الرجالية',
              description: 'تفصيل قمصان رجالية بتصاميم عصرية وأقمشة عالية الجودة',
              price: 299,
              deliveryTime: 5,
              rating: 4.6,
              reviewsCount: 56,
              images: [
                '/assets/images/services/shirt1.jpg'
              ],
              categoryId: 'cat1',
              isActive: true
            },
            {
              _id: 'service5',
              title: 'تفصيل ثياب وأزياء خليجية',
              description: 'خدمة تفصيل الثياب والأزياء الخليجية بمختلف الموديلات والأقمشة',
              price: 450,
              deliveryTime: 6,
              rating: 4.7,
              reviewsCount: 89,
              images: [
                '/assets/images/services/thobe1.jpg'
              ],
              categoryId: 'cat1',
              isActive: false
            }
          ]
        }
      };
    }
  },

  // رفع صورة للخدمة
  uploadServiceImage: async (formData) => {
    try {
      const response = await api.post('/services/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading service image:', error);
      
      // محاكاة استجابة ناجحة للتطوير
      return {
        data: {
          success: true,
          message: 'تم رفع الصورة بنجاح',
          imageUrl: '/assets/images/services/placeholder.jpg'
        }
      };
    }
  },

  // إضافة خدمة للمفضلة
  addToFavorites: async (serviceId) => {
    try {
      const response = await api.post(`/services/${serviceId}/favorites`);
      return response.data;
    } catch (error) {
      console.error(`Error adding service ${serviceId} to favorites:`, error);
      throw error;
    }
  },

  // إزالة خدمة من المفضلة
  removeFromFavorites: async (serviceId) => {
    try {
      const response = await api.delete(`/services/${serviceId}/favorites`);
      return response.data;
    } catch (error) {
      console.error(`Error removing service ${serviceId} from favorites:`, error);
      throw error;
    }
  },

  // جلب الخدمات المفضلة
  getFavoriteServices: async () => {
    try {
      const response = await api.get('/services/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite services:', error);
      
      // محاكاة البيانات للتطوير
      return {
        data: {
          services: [
            {
              _id: 'service2',
              title: 'تفصيل فساتين سهرة',
              description: 'تفصيل فساتين سهرة حسب الطلب بأحدث الموديلات وأرقى الأقمشة',
              price: 1200,
              deliveryTime: 14,
              rating: 4.7,
              images: [
                '/assets/images/services/dress1.jpg'
              ],
              professional: {
                _id: 'pro2',
                name: 'سارة أحمد'
              }
            }
          ]
        }
      };
    }
  },

  // إرسال رسالة للمحترف
  sendMessageToProfessional: async (messageData) => {
    try {
      const response = await api.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message to professional:', error);
      throw error;
    }
  }
};

export default professionalService;