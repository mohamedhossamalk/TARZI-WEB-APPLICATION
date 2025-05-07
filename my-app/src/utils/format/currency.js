// src/utils/format/currency.js
export const formatCurrency = (amount, locale = 'ar-EG', currency = 'EGP') => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number, locale = 'ar-EG') => {
  if (number === undefined || number === null) return '';
  
  return new Intl.NumberFormat(locale).format(number);
};