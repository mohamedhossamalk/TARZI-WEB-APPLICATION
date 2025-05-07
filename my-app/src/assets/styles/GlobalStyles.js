import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* الألوان الرئيسية */
    --red-500: #e53935;     /* أحمر رئيسي للأزرار والعناصر البارزة */
    --red-600: #d32f2f;     /* أحمر داكن للعناصر النشطة */
    --red-400: #ef5350;     /* أحمر فاتح للتأثيرات والتفاعلات */
    --red-300: #e57373;     /* أحمر أفتح للخلفيات المميزة */
    --red-100: #ffcdd2;     /* أحمر شفاف للخلفيات الخفيفة */
  
    /* الألوان السوداء والرمادية */
    --black: #000000;       /* أسود كامل للعناصر القوية */
    --black-900: #212121;   /* أسود داكن للنصوص */
    --black-800: #424242;   /* أسود متوسط للعناوين الثانوية */
    --grey-700: #616161;    /* رمادي داكن للنصوص الثانوية */
    --grey-500: #9e9e9e;    /* رمادي متوسط للحدود والفواصل */
    --grey-300: #e0e0e0;    /* رمادي فاتح للخلفيات وللفواصل */
    --grey-100: #f5f5f5;    /* رمادي شفاف للخلفيات الثانوية */
    --white: #ffffff;       /* أبيض للنصوص على الخلفيات الداكنة والخلفية الرئيسية */
  
    /* ألوان الحالات */
    --success: #4caf50;     /* نجاح */
    --warning: #ff9800;     /* تحذير */
    --error: #f44336;       /* خطأ */
    --info: #2196f3;        /* معلومات */

    /* متغيرات إضافية للاستخدام النمطي */
    --background: var(--white);
    --text-primary: var(--black-900);
    --text-secondary: var(--grey-700);
    --primary: var(--red-500);
    --primary-dark: var(--red-600);
    --primary-light: var(--red-400);
    --accent: var(--black);
    --border: var(--grey-300);
    --button-text: var(--white);
    --card-bg: var(--white);
    --header-bg: var(--black);
    --footer-bg: var(--black-900);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    direction: rtl;
    font-size: 16px;
  }

  body {
    font-family: 'Cairo', 'Roboto', sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.5;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  main {
    flex: 1;
  }

  a {
    text-decoration: none;
    color: var(--primary);
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  /* للانتقال السلس بين الصفحات */
  .page-transition {
    transition: opacity 0.3s ease;
  }

  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-enter-active {
    opacity: 1;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
  }
  
  /* تخصيص الـ scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--grey-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--grey-500);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
  }
`;