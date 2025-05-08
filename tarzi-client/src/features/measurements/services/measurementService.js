// src/features/measurements/services/measurementService.js
import api from '../../../core/api/axios-config';
import { toast } from 'react-toastify';

const measurementService = {
  // جلب جميع المقاسات للمستخدم الحالي
  getMeasurements: async () => {
    try {
      // محاولة الاتصال بـ API الحقيقي
      const response = await api.get('/measurements');
      return response;
    } catch (error) {
      console.log('Using mock data for measurements');
      
      // بيانات وهمية في حالة عدم وجود API
      const mockMeasurements = [
        {
          _id: '1',
          name: 'قياساتي الرئيسية',
          unit: 'cm',
          height: 175,
          chest: 95,
          waist: 80,
          hips: 100,
          shoulder: 45,
          sleeve: 65,
          inseam: 80,
          neck: 38,
          isDefault: true,
          notes: 'هذه قياساتي المفضلة للملابس اليومية',
          createdAt: new Date('2024-01-15').toISOString()
        },
        {
          _id: '2',
          name: 'قياسات البدل',
          unit: 'cm',
          height: 175,
          chest: 96,
          waist: 82,
          hips: 100,
          shoulder: 45,
          sleeve: 66,
          inseam: 80,
          neck: 39,
          isDefault: false,
          notes: 'قياسات مخصصة للبدل الرسمية',
          createdAt: new Date('2024-02-05').toISOString()
        },
        {
          _id: '3',
          name: 'قياسات بالإنش',
          unit: 'inch',
          height: 69,
          chest: 37.5,
          waist: 31.5,
          hips: 39.5,
          shoulder: 17.5,
          sleeve: 25.5,
          inseam: 31.5,
          neck: 15,
          isDefault: false,
          createdAt: new Date('2024-03-10').toISOString()
        }
      ];
      
      // محاكاة استجابة API
      return {
        data: {
          measurements: mockMeasurements,
          success: true
        }
      };
    }
  },
  
  // جلب مقاس محدد
  getMeasurementById: async (id) => {
    try {
      const response = await api.get(`/measurements/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching measurement:', error);
      throw error;
    }
  },
  
  // إنشاء مقاس جديد
  createMeasurement: async (measurementData) => {
    try {
      const response = await api.post('/measurements', measurementData);
      toast.success('تم إضافة المقاس بنجاح');
      return response;
    } catch (error) {
      console.error('Error creating measurement:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة المقاس');
      throw error;
    }
  },
  
  // تحديث مقاس
  updateMeasurement: async (id, measurementData) => {
    try {
      const response = await api.put(`/measurements/${id}`, measurementData);
      toast.success('تم تحديث المقاس بنجاح');
      return response;
    } catch (error) {
      console.error('Error updating measurement:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث المقاس');
      throw error;
    }
  },
  
  // حذف مقاس
  deleteMeasurement: async (id) => {
    try {
      const response = await api.delete(`/measurements/${id}`);
      toast.success('تم حذف المقاس بنجاح');
      return response;
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف المقاس');
      throw error;
    }
  },
  
  // تعيين مقاس كافتراضي
  setDefaultMeasurement: async (id) => {
    try {
      const response = await api.put(`/measurements/${id}/default`, {});
      toast.success('تم تعيين المقاس كافتراضي بنجاح');
      return response;
    } catch (error) {
      console.error('Error setting default measurement:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تعيين المقاس كافتراضي');
      throw error;
    }
  }
};

export default measurementService;