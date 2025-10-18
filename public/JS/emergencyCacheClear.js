/**
 * EMERGENCY CACHE KILLER - Load this FIRST
 * Runs only ONCE per session to clear corrupted caches
 */

(function() {
    'use strict';
    
    // Check if already cleared in this session
    const CLEARED_FLAG = 'emergencyCacheCleared';
    
    // Skip if already cleared
    if (sessionStorage.getItem(CLEARED_FLAG) === 'true') {
        console.log('%c✅ Cache already cleared this session', 'color: green; font-size: 14px;');
        return;
    }
    
    console.log('%c🚨 EMERGENCY CACHE KILLER ACTIVATED', 'color: red; font-size: 20px; font-weight: bold;');
    
    let cleared = false;
    
    async function emergencyCacheClear() {
        if (cleared) return;
        cleared = true;
        
        console.log('%c🧹 Starting emergency cache clear...', 'color: orange; font-size: 16px;');
        
        const steps = [];
        
        // Step 1: Unregister ALL service workers
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                console.log(`Found ${registrations.length} service workers`);
                for (let registration of registrations) {
                    await registration.unregister();
                    console.log('✅ Service Worker unregistered');
                }
                steps.push('Service Workers: Unregistered');
            } catch (e) {
                console.error('Service Worker error:', e);
            }
        }
        
        // Step 2: Delete ALL caches
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                console.log(`Found ${cacheNames.length} caches:`, cacheNames);
                for (let cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log('✅ Cache deleted:', cacheName);
                }
                steps.push('Cache Storage: Cleared');
            } catch (e) {
                console.error('Cache error:', e);
            }
        }
        
        // Step 3: Delete ALL IndexedDB databases
        if ('indexedDB' in window) {
            try {
                const databases = await indexedDB.databases();
                console.log(`Found ${databases.length} databases`);
                for (let db of databases) {
                    indexedDB.deleteDatabase(db.name);
                    console.log('✅ Database deleted:', db.name);
                }
                steps.push('IndexedDB: Cleared');
            } catch (e) {
                console.error('IndexedDB error:', e);
            }
        }
        
        // Step 4: Clear localStorage (preserve emergency flag)
        try {
            const keysToPreserve = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !key.includes('emergency')) {
                    keysToPreserve.push(key);
                }
            }
            keysToPreserve.forEach(key => localStorage.removeItem(key));
            console.log('✅ localStorage cleared');
            steps.push('localStorage: Cleared');
        } catch (e) {
            console.error('localStorage error:', e);
        }
        
        console.log('%c✅ CACHE CLEAR COMPLETE!', 'color: green; font-size: 18px; font-weight: bold;');
        console.log('Steps completed:', steps);
        
        // Mark as cleared in this session
        sessionStorage.setItem(CLEARED_FLAG, 'true');
        
        // Show notification if body exists
        if (document.body) {
            showNotification(steps);
        }
        
        // ONE-TIME reload only if caches were found
        if (cacheNames && cacheNames.length > 0) {
            console.log('%c🔄 Reloading to apply changes...', 'color: blue; font-size: 16px;');
            setTimeout(() => {
                window.location.reload(true);
            }, 2000);
        } else {
            console.log('%c✅ No reload needed - continuing...', 'color: green; font-size: 16px;');
        }
    }
    
    function showNotification(steps) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            max-width: 400px;
            animation: slideIn 0.5s ease;
        `;
        notification.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">
                ✅ Cache Cleared!
            </h3>
            <p style="margin: 0 0 10px 0; font-size: 14px;">
                ${steps.join('<br>')}
            </p>
            <p style="margin: 0; font-size: 14px; font-weight: bold;">
                Page cleaned successfully!
            </p>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emergencyCacheClear);
    } else {
        emergencyCacheClear();
    }
    
})();
