// src/main_temp.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './temp.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>ترزي</h1>
        <p>متجر الأزياء الراقية</p>
      </header>
      <main className="main">
        <div className="container">
          <h2>مرحبًا بك في تطبيق ترزي</h2>
          <p>هذه صفحة بدء مؤقتة للتحقق من عمل التطبيق بشكل أساسي</p>
          <div className="cards">
            <div className="card">
              <h3>بدل مخصصة</h3>
              <p>صمم بدلتك بالشكل الذي يناسبك</p>
            </div>
            <div className="card">
              <h3>قياسات دقيقة</h3>
              <p>قياسات مضبوطة تناسب جسمك</p>
            </div>
            <div className="card">
              <h3>أقمشة فاخرة</h3>
              <p>أجود أنواع الأقمشة المستوردة</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} ترزي</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
