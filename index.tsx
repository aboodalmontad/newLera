import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تسجيل وتفعيل الـ Service Worker بقوة
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('SW Registered');
        // إجبار التحديث إذا وجد نسخة جديدة لضمان عدم بقاء المستخدم على نسخة معطلة
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload();
              }
            };
          }
        };
      })
      .catch(err => console.log('SW Registration failed', err));
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