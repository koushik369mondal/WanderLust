const CACHE_NAME = 'wanderlust-v1';
const STATIC_CACHE = 'wanderlust-static-v1';
const DYNAMIC_CACHE = 'wanderlust-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/trip-planner',
  '/trip-planner/my-trips',
  '/css/style.css',
  '/css/admin-dashboard.css',
  '/css/holiday.css',
  '/css/loading.css',
  '/css/packingList.css',
  '/css/rating.css',
  '/js/script.js',
  '/js/admin-dashboard.js',
  '/js/loading.js',
  '/js/map.js',
  '/js/packingList.js',
  '/js/weather.js',
  '/js/offlineManager.js',
  '/images/travel_cover-1500x1000.jpeg',
  '/images/compass.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
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

  // For other requests, try cache first, then network
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
          .catch(() => {
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/trip-planner/my-trips');
            }
          });
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
