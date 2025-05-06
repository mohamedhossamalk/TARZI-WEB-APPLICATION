import * as yup from 'yup';

/**
 * Login form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const loginSchema = (t) => yup.object({
  email: yup.string()
    .email(t('validation.email.invalid'))
    .required(t('validation.email.required')),
  password: yup.string()
    .required(t('validation.password.required'))
});

/**
 * Register form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const registerSchema = (t) => yup.object({
  username: yup.string()
    .required(t('validation.username.required'))
    .min(3, t('validation.username.min')),
  email: yup.string()
    .email(t('validation.email.invalid'))
    .required(t('validation.email.required')),
  phone: yup.string()
    .required(t('validation.phone.required'))
    .matches(/^[0-9]+$/, t('validation.phone.matches')),
  password: yup.string()
    .required(t('validation.password.required'))
    .min(6, t('validation.password.min')),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], t('validation.confirmPassword.match'))
    .required(t('validation.confirmPassword.required'))
});

/**
 * Product form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const productSchema = (t) => yup.object({
  name: yup.string()
    .required(t('validation.product.nameRequired')),
  price: yup.number()
    .required(t('validation.product.priceRequired'))
    .positive(t('validation.product.pricePositive'))
});

/**
 * Measurement form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const measurementSchema = (t) => yup.object({
  name: yup.string()
    .required(t('validation.measurement.nameRequired')),
  chest: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  waist: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  hips: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  shoulder: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  sleeve: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  inseam: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive')),
  neck: yup.number()
    .typeError(t('validation.measurement.numberRequired'))
    .positive(t('validation.measurement.positive'))
});

/**
 * Address form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const addressSchema = (t) => yup.object({
  address: yup.string()
    .required(t('validation.address.required')),
  city: yup.string()
    .required(t('validation.city.required')),
  postalCode: yup.string()
    .required(t('validation.postalCode.required')),
  country: yup.string()
    .required(t('validation.country.required'))
});

/**
 * Change password form validation schema
 * @param {Function} t - Translation function
 * @returns {Object} Validation schema
 */
export const changePasswordSchema = (t) => yup.object({
  currentPassword: yup.string()
    .required(t('validation.currentPassword.required')),
  newPassword: yup.string()
    .required(t('validation.newPassword.required'))
    .min(6, t('validation.password.min')),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref('newPassword')], t('validation.confirmPassword.match'))
    .required(t('validation.confirmPassword.required'))
});