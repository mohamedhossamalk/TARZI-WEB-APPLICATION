// src/core/hooks/useMeasurements.js
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import api from '../api/axios-config';
import endpoints from '../api/endpoints';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useMeasurements = () => {
  const { isAuthenticated } = useAuth();
  const [defaultMeasurement, setDefaultMeasurement] = useState(null);

  // جلب جميع المقاسات للمستخدم
  const {
    data: measurements = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    'measurements',
    async () => {
      if (!isAuthenticated) return [];
      
      const response = await api.get(endpoints.measurements.getAll);
      return response.data.measurements;
    },
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        // تحديد المقاس الافتراضي
        const defaultMeas = data.find(m => m.isDefault);
        if (defaultMeas) {
          setDefaultMeasurement(defaultMeas);
        }
      },
      onError: (error) => {
        console.error('خطأ في جلب المقاسات:', error);
      }
    }
  );

  // إنشاء مقاس جديد
  const createMeasurement = useCallback(async (data) => {
    try {
      const response = await api.post(endpoints.measurements.create, data);
      toast.success('تم إضافة المقاس بنجاح');
      refetch();
      return response.data.measurement;
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة المقاس');
      throw error;
    }
  }, [refetch]);

  // تحديث مقاس
  const updateMeasurement = useCallback(async (id, data) => {
    try {
      const response = await api.put(endpoints.measurements.update(id), data);
      toast.success('تم تحديث المقاس بنجاح');
      refetch();
      return response.data.measurement;
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث المقاس');
      throw error;
    }
  }, [refetch]);

  // حذف مقاس
  const deleteMeasurement = useCallback(async (id) => {
    try {
      await api.delete(endpoints.measurements.delete(id));
      toast.success('تم حذف المقاس بنجاح');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف المقاس');
      throw error;
    }
  }, [refetch]);

  // تعيين مقاس كافتراضي
  const setDefaultMeasurementById = useCallback(async (id) => {
    try {
      const response = await api.put(endpoints.measurements.setDefault(id));
      toast.success('تم تعيين المقاس كافتراضي بنجاح');
      refetch();
      return response.data.measurement;
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تعيين المقاس كافتراضي');
      throw error;
    }
  }, [refetch]);

  return {
    measurements,
    defaultMeasurement,
    isLoading,
    error,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    setDefaultMeasurementById,
    refetch,
  };
};