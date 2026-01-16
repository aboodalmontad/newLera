const CACHE_NAME = 'syrian-lira-v2026-final';

// قائمة الموارد الأساسية - تأكد من مطابقة الروابط تماماً لما يتم طلبه
const ASSETS = [
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

// 1. مرحلة التثبيت: تخزين كل شيء فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Installing Sovereign Cache...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. مرحلة التنشيط: حذف النسخ القديمة والسيطرة الفورية
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        );
      })
    ])
  );
});

// 3. مرحلة جلب البيانات: الذكاء الحقيقي هنا
self.addEventListener('fetch', (event) => {
  // اعتراض طلبات التنقل (مثل فتح الموقع في تبويب جديد بدون إنترنت)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // استراتيجية Cache First لكل شيء آخر
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // إذا كان الملف جديداً (مثل خط لم يُذكر في القائمة)، خزن نسخة منه
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback في حال انقطاع الإنترنت التام لملفات معينة
        return new Response('Offline resource not found', { status: 404 });
      });
    })
  );
});