import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تسجيل Service Worker للعمل بدون إنترنت
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker Registered!');
        // محاولة التحديث في الخلفية إذا وجد نسخة جديدة
        reg.update();
      })
      .catch(err => console.log('Service Worker Error', err));
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// إخفاء مؤشر التحميل الأولي عند بدء React
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);