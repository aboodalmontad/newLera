import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// وظيفة تسجيل الـ Service Worker مع معالجة متقدمة للأخطاء الأمنية في بيئات المعاينة
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;

  // التحقق من البروتوكول ومن عدم وجود التطبيق داخل إطار (iFrame) قد يقيد الصلاحيات
  const isSecureContext = window.isSecureContext || window.location.protocol === 'https:';
  const isInsideIframe = window.self !== window.top;

  if (!isSecureContext) {
    console.warn('Service Worker requires a secure context (HTTPS).');
    return;
  }

  try {
    // في بيئات المعاينة (مثل AI Studio)، قد يختلف النطاق الفعلي عن النطاق الملحوظ
    // مما يتسبب في خطأ SecurityError عند محاولة تسجيل SW.
    const registration = await navigator.serviceWorker.register('./sw.js', { 
      scope: './' 
    });

    console.log('SW Registered successfully:', registration.scope);
    
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content available; auto-refreshing for offline use...');
            window.location.reload();
          }
        };
      }
    };
  } catch (err: any) {
    // معالجة خطأ SecurityError الناتج عن تعارض النطاقات في بيئات المعاينة
    if (err.name === 'SecurityError' || err.message?.includes('origin')) {
      console.warn('Service Worker registration skipped due to environment restrictions (Origin Mismatch). This is expected in some preview environments. The app will work in online mode.');
    } else {
      console.error('Service Worker registration failed:', err);
    }
  }
};

// تنفيذ التسجيل بعد تحميل الصفحة بالكامل
window.addEventListener('load', registerServiceWorker);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}