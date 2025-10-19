/**
 * Force Reload Utility - Clears all caches and forces a hard refresh
 * Use this when you've made code changes but the browser is still showing old cached content
 */

(function() {
    console.log('%c🔄 FORCE RELOAD UTILITY LOADED', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    
    // Function to force a complete reload
    window.forceReload = async function() {
        console.log('%c🧹 Starting complete cache clear...', 'color: #ffaa00; font-size: 14px;');
        
        try {
            // 1. Unregister all service workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                    console.log('✅ Service Worker unregistered');
                }
            }
            
            // 2. Clear all caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (let cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log(`✅ Cache deleted: ${cacheName}`);
                }
            }
            
            // 3. Clear IndexedDB
            if ('indexedDB' in window) {
                const databases = await indexedDB.databases();
                for (let db of databases) {
                    indexedDB.deleteDatabase(db.name);
                    console.log(`✅ IndexedDB deleted: ${db.name}`);
                }
            }
            
            // 4. Clear localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();
            console.log('✅ localStorage and sessionStorage cleared');
            
            console.log('%c✨ ALL CACHES CLEARED! Reloading in 2 seconds...', 'color: #00ff00; font-size: 16px; font-weight: bold;');
            
            // 5. Hard reload the page
            setTimeout(() => {
                window.location.reload(true);
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error clearing caches:', error);
            console.log('%c⚠️ Attempting manual hard refresh...', 'color: #ff5500; font-size: 14px;');
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        }
    };
    
    // Log instructions
    console.log('%c📋 INSTRUCTIONS:', 'color: #00aaff; font-size: 14px; font-weight: bold;');
    console.log('%c   Run: forceReload()', 'color: #ffffff; font-size: 12px;');
    console.log('%c   This will clear ALL caches and force a hard refresh', 'color: #aaaaaa; font-size: 11px;');
    console.log('');
})();
