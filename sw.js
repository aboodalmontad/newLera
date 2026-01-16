const CACHE_NAME = 'syrian-lira-pwa-v6';

// قائمة الملفات التي يجب تخزينها فوراً لضمان عمل الواجهة
const MANDATORY_ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './manifest.json',
  './services/geminiService.ts',
  './components/ConverterCard.tsx',
  './components/AIAssistant.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  // إجبار الـ SW الجديد على العمل فوراً
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري تجهيز النسخة الاحتياطية أوفلاين...');
      return Promise.allSettled(
        MANDATORY_ASSETS.map(url => 
          cache.add(url).catch(err => console.warn(`فشل تخزين مورد: ${url}`, err))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // حذف الكاش القديم لتجنب التضارب
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // استثناء طلبات الذكاء الاصطناعي (تحتاج إنترنت دائماً)
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // إذا كان الطلب ناجحاً، نخزنه للمرات القادمة (Dynamic Caching)
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حال انقطاع الإنترنت التام وفشل الطلب
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});