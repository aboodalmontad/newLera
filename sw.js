const CACHE_NAME = 'syrian-lira-final-v5';

// الملفات الأساسية التي يجب أن تتوفر للإقلاع الأولي
const PRE_CACHE_RESOURCES = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_RESOURCES);
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
  // لا نقوم بتخزين طلبات الـ API الخاصة بـ Gemini لأنها تحتاج إنترنت دائماً
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الكاش، نرجعه فوراً (أسرع وأضمن أوفلاين)
      if (cachedResponse) {
        return cachedResponse;
      }

      // إذا لم يكن موجوداً، نجلبه من الشبكة ونخزنه للمرة القادمة
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // نقوم بتخزين الملفات المصدرية والتبعيات من esm.sh و tailwind
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // إذا فشل الاتصال بالكامل (أوفلاين) وكان الطلب لصفحة (Navigation)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});