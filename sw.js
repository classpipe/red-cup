// Offline-first service worker with comprehensive caching
const CACHE = 'reserv-plus-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  // Icons
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/icons/icon-warning.png',
  './assets/icons/icon-guard.png',
  './assets/icons/qr.png',
  // Images
  './assets/img/face.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Failed to cache some assets:', err);
        // Continue even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Skip non-GET requests
  if (req.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!req.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(req).then(cached => {
      // Cache First strategy: use cache if available, otherwise fetch from network
      if (cached) {
        return cached;
      }
      
      // Try to fetch from network
      return fetch(req).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response (streams can only be consumed once)
        const responseToCache = response.clone();
        
        // Cache the response for future use
        caches.open(CACHE).then(cache => {
          cache.put(req, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // If network fails and we don't have it cached, return a fallback
        // For navigation requests, return the cached index.html
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // For other requests, return a basic error response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
