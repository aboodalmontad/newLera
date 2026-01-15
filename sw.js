const CACHE_NAME = 'syrian-lira-ultimate-v10';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './metadata.json',
  './manifest.json',
  './components/ConverterCard.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap',
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3/',
  'https://esm.sh/react@^19.2.3/es2022/react.mjs',
  'https://esm.sh/react-dom@^19.2.3/es2022/react-dom.mjs'
];

// التثبيت: تخزين كل شيء فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري تأمين ملفات التشغيل أوفلاين...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// التفعيل: تنظيف الذاكرة القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// الجلب: الذاكرة أولاً ثم الشبكة
self.addEventListener('fetch', (event) => {
  // للطلبات التي تطلب صفحات (Navigation)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // تخزين أي ملف جديد يتم جلبه تلقائياً
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حال الفشل التام وأنت أوفلاين
        if (event.request.destination === 'image') {
          return caches.match('https://cdn-icons-png.flaticon.com/512/2489/2489756.png');
        }
      });
    })
  );
});