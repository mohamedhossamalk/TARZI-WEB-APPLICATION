// src/core/utils/formatters.js
import { CURRENCY, DATE_FORMAT } from '../../config/constants';
import moment from 'moment';
import 'moment/locale/ar';

// تعيين اللغة العربية
moment.locale('ar');

//تنسيق التاريخ
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  const date = new Date(dateString);
  
  return date.toLocaleDateString('ar-SA', mergedOptions);
};

// تنسيق وقت نسبي (منذ)
export const formatRelativeTime = (date) => {
  return moment(date).fromNow();
};



// تنسيق العملة
export const formatCurrency = (amount, currency = 'ر.س') => {
  if (amount === undefined || amount === null) return '';
  return `${amount.toLocaleString('ar-SA')}`;
};


// تنسيق النسبة المئوية
export const formatPercentage = (value) => {
  return `${value}%`;
};

// تنسيق الرقم
export const formatNumber = (number) => {
  return new Intl.NumberFormat('ar-EG').format(number);
};

// تنسيق الهاتف
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // إذا كان الرقم يبدأ بـ +20 (مصر)
  if (phone.startsWith('+20') && phone.length === 13) {
    return `+20 ${phone.substring(3, 5)} ${phone.substring(5, 8)} ${phone.substring(8)}`;
  }
  
  // إذا كان الرقم يبدأ بـ 0
  if (phone.startsWith('0') && phone.length === 11) {
    return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6)}`;
  }
  
  return phone;
};

// تنسيق العنوان
export const formatAddress = (address) => {
  if (!address) return '';
  
  const {
    street,
    buildingNo,
    apartmentNo,
    district,
    city,
    state,
    postalCode,
    country
  } = address;
  
  const parts = [];
  
  if (street) parts.push(street);
  if (buildingNo) parts.push(`عمارة ${buildingNo}`);
  if (apartmentNo) parts.push(`شقة ${apartmentNo}`);
  if (district) parts.push(district);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (postalCode) parts.push(`الرمز البريدي: ${postalCode}`);
  if (country) parts.push(country);
  
  return parts.join('، ');
};

// تنسيق حجم الملف
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 بايت';
  
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// تنسيق الوقت المنقضي (للتصاعدي)
export const formatElapsedTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
// src/core/utils/formatters.js (تكملة)
// تحويل حالة الطلب إلى نص مفهوم
export const formatOrderStatus = (status) => {
  const statusMap = {
    'pending': 'قيد الانتظار',
    'processing': 'قيد المعالجة',
    'shipped': 'تم الشحن',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي',
    'returned': 'مرتجع'
  };

  return statusMap[status] || status;
};

// تحويل دور المستخدم إلى نص مفهوم
export const formatUserRole = (role) => {
  const roleMap = {
    'user': 'مستخدم',
    'admin': 'مسؤول',
    'professional': 'مهني'
  };

  return roleMap[role] || role;
};

// تحويل اسم المنتج إلى URL آمن
export const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// تنسيق الاسم الكامل
export const formatFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// اختصار النص إذا كان طويلاً
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// تنسيق حالة المنتج
export const formatProductStock = (stock) => {
  if (stock > 10) return 'متوفر';
  if (stock > 0) return `متبقي ${stock} فقط`;
  return 'غير متوفر';
};

// تحويل لون إلى نص مفهوم
export const formatColorName = (colorCode) => {
  const colorMap = {
    'white': 'أبيض',
    'black': 'أسود',
    'red': 'أحمر',
    'blue': 'أزرق',
    'green': 'أخضر',
    'yellow': 'أصفر',
    'orange': 'برتقالي',
    'purple': 'بنفسجي',
    'pink': 'وردي',
    'gray': 'رمادي',
    'brown': 'بني',
    'beige': 'بيج',
    'navy': 'كحلي',
    'turquoise': 'تركواز',
    'gold': 'ذهبي',
    'silver': 'فضي'
  };

  return colorMap[colorCode] || colorCode;
};

// تحويل نوع القماش إلى نص مفهوم
export const formatFabricType = (fabricCode) => {
  const fabricMap = {
    'cotton': 'قطن',
    'linen': 'كتان',
    'silk': 'حرير',
    'wool': 'صوف',
    'polyester': 'بوليستر',
    'nylon': 'نايلون',
    'velvet': 'مخمل',
    'denim': 'جينز',
    'cashmere': 'كشمير',
    'blend': 'خليط'
  };

  return fabricMap[fabricCode] || fabricCode;
};

// تنسيق رقم الطلب
export const formatOrderNumber = (orderId) => {
  if (!orderId) return '';
  
  // إذا كان هناك رقم طلب مخصص، استخدمه
  if (orderId.startsWith('ORD')) return orderId;
  
  // وإلا استخدم آخر 8 أحرف من معرف MongoDB
  const shortId = orderId.substring(orderId.length - 8);
  return `ORD-${shortId}`;
};

// تنسيق حجم الصورة
export const formatImageSize = (width, height) => {
  return `${width}×${height}`;
};
