// ============================================
// 🔴 SELF-DESTRUCTING SERVICE WORKER
// ============================================
// This service worker immediately unregisters itself
// and clears all caches to prevent cache corruption.
// DO NOT restore old caching code!
// ============================================

console.log('🔴 SERVICE WORKER: Self-destruct sequence initiated');

// Immediately skip waiting and activate
self.addEventListener('install', (event) => {
  console.log('🔴 SERVICE WORKER: Installing self-destruct version...');
  self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', (event) => {
  console.log('🔴 SERVICE WORKER: Activating self-destruct...');
  event.waitUntil(
    (async () => {
      // Delete ALL caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log(`🔴 SERVICE WORKER: Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      
      // Unregister this service worker
      const registrations = await self.registration.unregister();
      console.log('🔴 SERVICE WORKER: Self-destructed successfully!', registrations);
      
      // Claim all clients to take control immediately
      return self.clients.claim();
    })()
  );
});

// No fetch event handler - let all requests go to network
self.addEventListener('fetch', (event) => {
<<<<<<< HEAD
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
=======
  // Do nothing - all requests pass through to network
>>>>>>> db0e0818c2c9452899f84576225035f060b3fb67
});
