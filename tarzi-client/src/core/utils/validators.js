// src/core/utils/validators.js
// التحقق من صحة البريد الإلكتروني
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// التحقق من صحة رقم الهاتف المصري
export const isValidEgyptianPhone = (phone) => {
  // يقبل الأرقام التي تبدأ بـ 01 ويليها 9 أرقام
  // أو الأرقام التي تبدأ بـ +201 ويليها 9 أرقام
  const re = /^((\+|00)?(201)|0?1)[0-2,5]{1}[0-9]{8}$/;
  return re.test(String(phone));
};

// التحقق من صحة كلمة المرور
export const isValidPassword = (password) => {
  // يجب أن تكون كلمة المرور على الأقل 6 أحرف
  return password && password.length >= 6;
};

// التحقق من اتفاق كلمتي المرور
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// التحقق من أن النص ليس فارغاً
export const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

// التحقق من أن الرقم أكبر من صفر
export const isPositiveNumber = (value) => {
  return !isNaN(value) && Number(value) > 0;
};

// التحقق من أن الرقم عدد صحيح
export const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

// التحقق من أن القيمة أقل من أو تساوي الحد الأقصى
export const isLessThanOrEqual = (value, max) => {
  return Number(value) <= max;
};

// التحقق من أن القيمة أكبر من أو تساوي الحد الأدنى
export const isGreaterThanOrEqual = (value, min) => {
  return Number(value) >= min;
};

// التحقق من أن القيمة في نطاق محدد
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return num >= min && num <= max;
};

// التحقق من أن القيمة في قائمة محددة
export const isInList = (value, list) => {
  return list.includes(value);
};

// التحقق من أن الطول لا يتجاوز الحد الأقصى
export const maxLength = (value, max) => {
  return value.length <= max;
};

// التحقق من أن الطول لا يقل عن الحد الأدنى
export const minLength = (value, min) => {
  return value.length >= min;
};

// التحقق من صحة الرمز البريدي المصري
export const isValidEgyptianPostalCode = (postalCode) => {
  // الرمز البريدي المصري هو 5 أرقام
  const re = /^\d{5}$/;
  return re.test(String(postalCode));
};

// التحقق من صحة رقم البطاقة الائتمانية
export const isValidCreditCard = (cardNumber) => {
  // التحقق من أن الرقم يتكون من 16 رقماً فقط
  const re = /^\d{16}$/;
  return re.test(String(cardNumber));
};

// التحقق من صحة تاريخ انتهاء البطاقة
export const isValidExpiryDate = (month, year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() يبدأ من 0
  
  // تحويل الشهر والسنة إلى أرقام
  const expMonth = parseInt(month);
  // إذا كانت السنة مكونة من رقمين، أضف 2000
  const expYear = parseInt(year.length === 2 ? `20${year}` : year);
  
  // التحقق من أن التاريخ لم ينته
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  // التحقق من صحة الشهر
  return expMonth >= 1 && expMonth <= 12;
};

// التحقق من صحة رمز CVV
export const isValidCVV = (cvv) => {
  // رمز CVV يتكون من 3 أو 4 أرقام
  const re = /^\d{3,4}$/;
  return re.test(String(cvv));
};

// التحقق من صحة رابط URL
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// التحقق من صحة لون HEX
export const isValidHexColor = (color) => {
  const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return re.test(color);
};