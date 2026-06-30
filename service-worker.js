const CACHE_NAME = 'upsc-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2942/2942559.png'
];

// Install Lifecycle Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => {
      // Forces the waiting service worker to become the active service worker immediately
      return self.skipWaiting();
    })
  );
});

// Activation Lifecycle Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Allows the active service worker to immediately take control of all open clients/tabs
      return self.clients.claim();
    })
  );
});

// Network Fetch Interception (Cache-First Strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached asset if found, otherwise make a network request
      return cachedResponse || fetch(event.request);
    })
  );
});
