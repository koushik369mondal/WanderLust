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
  // Do nothing - all requests pass through to network
});
