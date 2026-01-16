import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تفعيل الـ Service Worker بأكثر الطرق استقراراً
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(registration => {
        console.log('SW Status: Active');
        
        // التحقق من وجود تحديثات
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // هناك نسخة جديدة، قم بالتحديث التلقائي
                window.location.reload();
              }
            };
          }
        };
      })
      .catch(error => {
        console.error('SW Registration failed:', error);
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