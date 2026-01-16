const CACHE_NAME = 'lira-safe-v1';

// قائمة الموارد الحيوية - يجب أن تكون الروابط مطابقة تماماً لما في index.html
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './manifest.json',
  './components/ConverterCard.tsx',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@19.0.0',
  'https://esm.sh/react-dom@19.0.0',
  'https://esm.sh/react-dom@19.0.0/client',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  // تفعيل الـ SW فوراً دون انتظار إغلاق التبويبات المفتوحة
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching vital assets...');
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => 
          fetch(url, { cache: 'reload' }).then(response => {
            if (response.ok) return cache.put(url, response);
            throw new Error(`Failed to cache ${url}`);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // استراتيجية: ابحث في الكاش أولاً (Cache First)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      // إذا وجد المورد في الكاش، أرجعه فوراً
      if (response) return response;
      
      // إذا لم يوجد، حاول جلبه من الشبكة
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }
        
        // قم بتخزين النسخة الجديدة للاستخدام القادم
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch(() => {
        // إذا فشل الإنترنت ولم يجد المورد، ارجع للصفحة الرئيسية
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});