const CACHE_NAME = 'syrian-lira-v2026-ultra';

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

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Ultra Precaching...');
      return cache.addAll(ASSETS);
    })
  );
});

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

self.addEventListener('fetch', (event) => {
  // إذا كان الطلب هو المتصفح نفسه (Navigation)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request);
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // استراتيجية Cache-First المطلقة للمكتبات والخطوط
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((netRes) => {
        if (netRes.ok) {
          const clone = netRes.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return netRes;
      });
    })
  );
});