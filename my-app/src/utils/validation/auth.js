// src/utils/validation/auth.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // يجب أن تكون كلمة المرور 8 أحرف على الأقل ويجب أن تحتوي على حرف كبير وحرف صغير ورقم
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phoneNumber) => {
  // التحقق من أرقام الهواتف المصرية
  const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
  return phoneRegex.test(phoneNumber);
};