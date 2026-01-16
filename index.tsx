import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تسجيل الـ Service Worker بطريقة مباشرة لتجنب مشاكل المسارات المعقدة
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // استخدام مسار نسبي مباشر بدلاً من constructor URL المعقد
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('SW: Registered with scope:', reg.scope);
        
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // تفعيل التحديث فوراً عند توفر نسخة جديدة
                window.location.reload();
              }
            };
          }
        };
      })
      .catch(err => {
        // تجاهل أخطاء الأصل في بيئات المعاينة إذا كانت القيود صارمة
        console.warn('SW: Registration failed (Normal in some preview environments):', err.message);
      });
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