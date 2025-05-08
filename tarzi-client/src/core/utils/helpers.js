// src/core/utils/helpers.js
import { toast } from 'react-toastify';

// عرض رسالة نجاح
export const showSuccess = (message) => {
  toast.success(message);
};

// عرض رسالة خطأ
export const showError = (message) => {
  toast.error(message);
};

// عرض رسالة تنبيه
export const showWarning = (message) => {
  toast.warning(message);
};

// عرض رسالة معلومات
export const showInfo = (message) => {
  toast.info(message);
};

// جلب معلومات المستخدم من التخزين المحلي
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم من التخزين المحلي:', error);
    return null;
  }
};

// جلب التوكن من التخزين المحلي
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

// حفظ معلومات المستخدم في التخزين المحلي
export const storeUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// حفظ التوكن في التخزين المحلي
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

// مسح معلومات المستخدم والتوكن من التخزين المحلي
export const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// إنشاء معلمات URL من كائن
export const createQueryParams = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

// جلب معلمات URL وتحويلها إلى كائن
export const getQueryParams = (url) => {
  const search = url.split('?')[1] || '';
  if (!search) return {};
  
  return search
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return params;
    }, {});
};

// تأخير التنفيذ
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// تحويل ملف إلى Base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// التحقق مما إذا كانت الصورة موجودة وصالحة
export const isImageValid = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// دمج مصفوفتين مع إزالة العناصر المكررة
export const mergeArrays = (arr1, arr2) => {
  return [...new Set([...arr1, ...arr2])];
};

// تصفية المصفوفة من العناصر المكررة
export const uniqueArray = (array, property = null) => {
  if (!property) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[property];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// ترتيب المصفوفة
export const sortArray = (array, property, direction = 'asc') => {
  const sortedArray = [...array];
  
  return sortedArray.sort((a, b) => {
    const valA = a[property];
    const valB = b[property];
    
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// تصفية المصفوفة
export const filterArray = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      
      const itemValue = item[key];
      const filterValue = filters[key];
      
      // إذا كان القيمة مصفوفة، تحقق من وجود القيمة في المصفوفة
      if (Array.isArray(itemValue)) {
        return itemValue.includes(filterValue);
      }
      
      // إذا كان قيمة التصفية مصفوفة، تحقق من وجود قيمة العنصر في المصفوفة
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      // إذا كانت القيمة نصية، تحقق من تطابقها (بدون حساسية لحالة الأحرف)
      if (typeof itemValue === 'string' && typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      
      // المقارنة العادية
      return itemValue === filterValue;
    });
  });
};

// تحويل الكائن إلى FormData (مفيد لرفع الملفات)
export const objectToFormData = (object) => {
  const formData = new FormData();
  
  Object.keys(object).forEach(key => {
    if (object[key] !== undefined && object[key] !== null) {
      // إذا كانت القيمة مصفوفة، أضف كل عنصر بشكل منفصل
      if (Array.isArray(object[key])) {
        object[key].forEach((value, index) => {
          // إذا كان العنصر ملف، أضفه بشكل مباشر
          if (value instanceof File) {
            formData.append(`${key}[${index}]`, value);
          }
          // إذا كان العنصر كائن، حوّله إلى JSON
          else if (typeof value === 'object') {
            formData.append(`${key}[${index}]`, JSON.stringify(value));
          }
          // وإلا، أضف القيمة كما هي
          else {
            formData.append(`${key}[${index}]`, value);
          }
        });
      }
      // إذا كانت القيمة ملف، أضفها بشكل مباشر
      else if (object[key] instanceof File) {
        formData.append(key, object[key]);
      }
      // إذا كانت القيمة كائن، حوّلها إلى JSON
      else if (typeof object[key] === 'object') {
        formData.append(key, JSON.stringify(object[key]));
      }
      // وإلا، أضف القيمة كما هي
      else {
        formData.append(key, object[key]);
      }
    }
  });
  
  return formData;
};

// إنشاء جلسة دفع باستخدام خدمة دفع وهمية
export const createPaymentSession = async (orderData) => {
  // هذه دالة وهمية تحاكي إنشاء جلسة دفع
  // في تطبيق حقيقي، يجب استخدام واجهة برمجة التطبيقات الخاصة بخدمة الدفع
  
  await delay(1000); // تأخير وهمي يحاكي طلب API
  
  const paymentSessionId = `PAY-${Math.random().toString(36).substring(2, 10)}`;
  
  return {
    paymentSessionId,
    amount: orderData.total,
    currency: 'EGP',
    redirectUrl: `/payment/confirm?sessionId=${paymentSessionId}&orderId=${orderData.orderId}`
  };
};

// تقسيم المصفوفة إلى مجموعات (مفيد للعرض في الشبكة)
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};