
// إعداد i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    lng: localStorage.getItem('language') || 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // لا تهرب من HTML
    },
    react: {
      useSuspense: true,
    },
  });

// دالة لتغيير اللغة
export const changeLanguage = (language) => {
  localStorage.setItem('language', language);
  i18n.changeLanguage(language);
  
  // تغيير اتجاه الصفحة بناءً على اللغة
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// تعيين اتجاه الصفحة عند التحميل
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;