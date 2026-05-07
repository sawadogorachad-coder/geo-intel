const CACHE_STATIC = 'geointel-static-v3';
const CACHE_TILES  = 'geointel-tiles-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './geo-data.js',
  './world-cities.js',
  './world-conflicts.js',
  './world-resources.js',
  './world-all-cities.js',
  './lib/leaflet/leaflet.js',
  './lib/leaflet/leaflet.css',
  './lib/fontawesome/css/all.min.css',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_STATIC).then(c => c.addAll(STATIC_ASSETS).catch(() => null)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_STATIC && k !== CACHE_TILES)
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 1. Ne PAS intercepter les API tierces (GDELT, etc.) — laisser passer
  if (url.origin !== self.location.origin) {
    if (url.host.includes('basemaps.cartocdn.com')) {
      // Cache des tuiles uniquement
      e.respondWith(
        caches.open(CACHE_TILES).then(async cache => {
          const cached = await cache.match(e.request);
          if (cached) return cached;
          try {
            const response = await fetch(e.request);
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          } catch {
            return new Response('', { status: 503 });
          }
        })
      );
    }
    // Sinon : laisser le navigateur traiter directement (pas de respondWith)
    return;
  }

  // 2. Assets locaux — cache-first, sans fallback vers index.html
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          caches.open(CACHE_STATIC).then(c => c.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => new Response('', { status: 503 }));
    })
  );
});
