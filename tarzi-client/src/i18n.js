import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import rtlDetect from 'rtl-detect';

import translationAR from './locales/ar/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  ar: {
    translation: translationAR
  },
  en: {
    translation: translationEN
  }
};

// Detect browser language
const detectUserLanguage = () => {
  const browserLanguage = navigator.language || navigator.userLanguage;
  const storedLanguage = localStorage.getItem('language');
  
  if (storedLanguage) {
    return storedLanguage;
  }
  
  // Check if language is Arabic or default to English
  if (browserLanguage && browserLanguage.includes('ar')) {
    return 'ar';
  }
  
  return 'ar'; // Default to Arabic for this app
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectUserLanguage(),
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    react: {
      useSuspense: true
    }
  });

// Update document direction based on language
const updateDocumentDirection = (language) => {
  document.dir = rtlDetect.isRtlLang(language) ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// Set initial direction
updateDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
  localStorage.setItem('language', lng);
});

export default i18n;