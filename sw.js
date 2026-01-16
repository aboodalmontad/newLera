const CACHE_NAME = 'syrian-lira-pwa-v5';

// قائمة الموارد التي سيتم سحبها وتخزينها في جهاز المستخدم فوراً
const PRE_CACHE_RESOURCES = [
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

// مرحلة التثبيت: تحميل كل شيء وتخزينه في الجهاز
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Building offline bunker...');
      return Promise.allSettled(
        PRE_CACHE_RESOURCES.map(url => 
          fetch(url, { cache: 'reload' })
            .then(res => {
              if (res.ok) return cache.put(url, res);
              throw new Error(`Critical asset failed: ${url}`);
            })
        )
      );
    })
  );
});

// مرحلة التنشيط: مسح أي نسخ قديمة ومعطلة
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

// مرحلة الاستجابة: الرد من الجهاز (الذاكرة) أولاً دون محاولة الاتصال بالإنترنت
self.addEventListener('fetch', (event) => {
  // لا نريد معالجة طلبات الـ API الخارجية إذا وجدت (مثل Gemini - ولكنها محذوفة حالياً)
  if (event.request.url.includes('google')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الجهاز، أرسله فوراً (سرعة فائقة + أوفلاين)
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // إذا لم يوجد (ملف جديد مثلاً)، جربه من الشبكة وخزنه للمرة القادمة
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // إذا انقطع الإنترنت تماماً ولم يجد الملف، ارجع للرئيسية
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});