const CACHE_NAME = 'syrian-lira-pwa-v3';

// الموارد الأساسية التي يجب تخزينها فوراً
const PRE_CACHE_ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './manifest.json',
  './components/ConverterCard.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap',
  'https://esm.sh/react@19.0.0',
  'https://esm.sh/react-dom@19.0.0',
  'https://esm.sh/react-dom@19.0.0/client'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching all assets');
      // نستخدم Promise.allSettled لضمان عدم فشل التثبيت بالكامل إذا فشل ملف واحد
      return Promise.allSettled(
        PRE_CACHE_ASSETS.map(asset => 
          cache.add(asset).catch(err => console.error(`Failed to cache ${asset}:`, err))
        )
      );
    })
  );
});

// تنظيف الكاش القديم عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// استراتيجية التحميل: الكاش أولاً، ثم الشبكة
self.addEventListener('fetch', (event) => {
  // استثناء لطلبات التصفح الأساسية (لضمان عمل index.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الكاش، أرجعه فوراً
      if (cachedResponse) {
        return cachedResponse;
      }

      // إذا لم يكن موجوداً، حاول جلبه من الشبكة وتخزينه للمرة القادمة
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // إذا كان المستخدم أوفلاين والملف غير موجود بالكاش
        if (event.request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
          return new Response('', { status: 404 });
        }
      });
    })
  );
});