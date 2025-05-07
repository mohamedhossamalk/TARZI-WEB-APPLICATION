// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --red-500: #e53935;
    --red-600: #d32f2f;
    --red-400: #ef5350;
    --red-300: #e57373;
    --red-100: #ffcdd2;
    
    --black: #000000;
    --black-900: #212121;
    --black-800: #424242;
    --grey-700: #616161;
    --grey-500: #9e9e9e;
    --grey-300: #e0e0e0;
    --grey-100: #f5f5f5;
    --white: #ffffff;
    
    --success: #4caf50;
    --warning: #ff9800;
    --error: #f44336;
    --info: #2196f3;
    
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

  body {
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    background-color: var(--background);
    color: var(--text-primary);
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary-dark);
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
`;