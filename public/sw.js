const CACHE_NAME = 'wanderlust-v1';
const STATIC_CACHE = 'wanderlust-static-v1';
const DYNAMIC_CACHE = 'wanderlust-dynamic-v1';

// Assets to cache immediately (only static assets - avoid dynamic routes which may return 5xx)
const STATIC_ASSETS = [
  '/',
  '/CSS/style.css',
  '/CSS/admin-dashboard.css',
  '/CSS/holiday.css',
  '/CSS/loading.css',
  '/CSS/packingList.css',
  '/CSS/rating.css',
  '/JS/script.js',
  '/JS/admin-dashboard.js',
  '/JS/loading.js',
  '/JS/map.js',
  '/JS/packingList.js',
  '/JS/weather.js',
  '/JS/offlineManager.js',
  '/images/travel_cover-1500x1000.jpeg',
  '/images/compass.png',
  '/manifest.json',
  '/offline.html' // Add the offline fallback page
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Cache assets individually and tolerate failures so one missing/500 asset won't fail the whole install
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        console.log('Service Worker: Caching static assets (individual, tolerant)');
        const results = await Promise.allSettled(STATIC_ASSETS.map(async (asset) => {
          try {
            // Use cache.add which fetches and stores the response
            await cache.add(asset);
            return { asset, status: 'fulfilled' };
          } catch (err) {
            console.error('Service Worker: Failed to cache asset', asset, err && err.message ? err.message : err);
            return { asset, status: 'rejected', reason: err };
          }
        }));
        // Optionally, log summary of failures
        const failures = results.filter(r => r.status === 'rejected');
        if (failures.length) {
          console.warn(`Service Worker: ${failures.length} asset(s) failed to cache during install. See earlier errors.`);
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Use Network-First strategy for navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    console.log('SW: navigation request for', url.pathname);
    event.respondWith(
      fetch(request)
        .then(response => {
          // Always return the network response for navigation; do not cache HTML pages here
          return response;
        })
        .catch(() => {
          // If the network fails, try to serve from the cache
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/offline.html');
          });
        })
    );
    return; // End execution here for navigation requests
  }

  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Handle trip detail pages specially for offline access
  if (url.pathname.match(/^\/trip-planner\/my-trips\/[a-f0-9]+$/)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful trip detail responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cached version, return offline trip list
            return caches.match('/trip-planner/my-trips');
          });
        })
    );
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/trip-planner/') && url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // For other requests (static assets like CSS, JS, images), use Cache-First strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => { /* For non-navigation requests, failing is okay if not in cache */ });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'sync-trips') {
    event.waitUntil(syncOfflineTrips());
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/compass.png',
      badge: '/images/compass.png',
      vibrate: [100, 50, 100],
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/trip-planner/my-trips')
  );
});

// Sync offline trips function
async function syncOfflineTrips() {
  try {
    // This will be called when the app comes back online
    // The actual sync logic will be handled by the offline manager
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_REQUEST',
        message: 'Syncing offline changes...'
      });
    });
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
