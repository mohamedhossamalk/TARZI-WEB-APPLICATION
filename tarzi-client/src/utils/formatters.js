// src/utils/formatters.js

// تنسيق الأسعار
export const formatPrice = (price, currency = 'SAR') => {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(price);
};

// تنسيق التواريخ
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// تنسيق رقم الهاتف
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // يفترض أن الرقم يبدأ بـ 966 أو 05 وطوله يكون 10 أرقام
  if (phone.startsWith('+')) {
    phone = phone.substring(1);
  }
  
  if (phone.startsWith('966')) {
    return `+966 ${phone.substring(3).replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')}`;
  } else if (phone.startsWith('05')) {
    return phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return phone;
};

// تقصير النص
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};