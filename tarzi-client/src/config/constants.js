// src/config/constants.js
// الثوابت المستخدمة في التطبيق

// الاسم والمعلومات الأساسية
export const APP_NAME = 'تارزي';
export const APP_DESCRIPTION = 'منصة للأزياء المخصصة والخدمات المهنية';
export const APP_VERSION = '1.0.0';

// رابط API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// حالات الطلبات
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

// ترجمات حالات الطلبات
export const ORDER_STATUS_TRANSLATIONS = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'مرتجع'
};

// ألوان حالات الطلبات
export const ORDER_STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'error'
};

// أدوار المستخدمين
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  PROFESSIONAL: 'professional'
};

// ترجمات أدوار المستخدمين
export const USER_ROLES_TRANSLATIONS = {
  user: 'مستخدم عادي',
  admin: 'مسؤول',
  professional: 'مهني'
};

// أنواع الأقمشة
export const FABRIC_TYPES = [
  { value: 'cotton', label: 'قطن' },
  { value: 'linen', label: 'كتان' },
  { value: 'silk', label: 'حرير' },
  { value: 'wool', label: 'صوف' },
  { value: 'polyester', label: 'بوليستر' },
  { value: 'nylon', label: 'نايلون' },
  { value: 'velvet', label: 'مخمل' },
  { value: 'denim', label: 'جينز' },
  { value: 'cashmere', label: 'كشمير' },
  { value: 'blend', label: 'خليط' }
];

// الألوان المتاحة
export const AVAILABLE_COLORS = [
  { value: 'white', label: 'أبيض' },
  { value: 'black', label: 'أسود' },
  { value: 'red', label: 'أحمر' },
  { value: 'blue', label: 'أزرق' },
  { value: 'green', label: 'أخضر' },
  { value: 'yellow', label: 'أصفر' },
  { value: 'orange', label: 'برتقالي' },
  { value: 'purple', label: 'بنفسجي' },
  { value: 'pink', label: 'وردي' },
  { value: 'gray', label: 'رمادي' },
  { value: 'brown', label: 'بني' },
  { value: 'beige', label: 'بيج' },
  { value: 'navy', label: 'كحلي' },
  { value: 'turquoise', label: 'تركواز' },
  { value: 'gold', label: 'ذهبي' },
  { value: 'silver', label: 'فضي' }
];

// فئات المنتجات الافتراضية
export const DEFAULT_CATEGORIES = [
  { value: 'suits', label: 'بدل' },
  { value: 'shirts', label: 'قمصان' },
  { value: 'pants', label: 'بناطيل' },
  { value: 'dresses', label: 'فساتين' },
  { value: 'abayas', label: 'عبايات' },
  { value: 'shoes', label: 'أحذية' },
  { value: 'accessories', label: 'إكسسوارات' },
  { value: 'others', label: 'أخرى' }
];

// فئات الخدمات المهنية
export const SERVICE_CATEGORIES = [
  { value: 'tailoring', label: 'خياطة' },
  { value: 'design', label: 'تصميم' },
  { value: 'styling', label: 'تنسيق المظهر' },
  { value: 'alteration', label: 'تعديل الملابس' },
  { value: 'consultation', label: 'استشارات الأزياء' },
  { value: 'photography', label: 'تصوير الأزياء' },
  { value: 'others', label: 'أخرى' }
];

// الوحدات المتاحة
export const MEASUREMENT_UNITS = [
  { value: 'cm', label: 'سم' },
  { value: 'inch', label: 'بوصة' }
];

// رسائل الخطأ الشائعة
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.',
  UNAUTHORIZED: 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
  NOT_FOUND: 'لم يتم العثور على البيانات المطلوبة.',
  SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
  VALIDATION_ERROR: 'يرجى التحقق من صحة البيانات المدخلة.',
  FORBIDDEN: 'ليس لديك صلاحية للوصول إلى هذه الصفحة.'
};

// حجم الصفحة الافتراضي
export const DEFAULT_PAGE_SIZE = 10;

// تنسيق التاريخ
export const DATE_FORMAT = 'DD/MM/YYYY';

// تنسيق العملة
export const CURRENCY = 'EGP';

// خيارات عرض المنتجات
export const PRODUCT_VIEW_OPTIONS = [
  { value: 'grid', label: 'شبكة' },
  { value: 'list', label: 'قائمة' }
];

// خيارات الترتيب
export const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'priceAsc', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'priceDesc', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'nameAsc', label: 'الاسم: أ-ي' },
  { value: 'nameDesc', label: 'الاسم: ي-أ' },
  { value: 'rating', label: 'التقييم' }
];