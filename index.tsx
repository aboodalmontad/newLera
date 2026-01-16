import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تسجيل الـ Service Worker بشكل مباشر ومبسط
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('SW Registered:', reg.scope);
        
        // التحقق من وجود تحديثات
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // تفعيل التحديث فوراً عند توفر نسخة جديدة لضمان عملها أوفلاين
                window.location.reload();
              }
            };
          }
        };
      })
      .catch(err => console.warn('SW registration failed:', err));
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}