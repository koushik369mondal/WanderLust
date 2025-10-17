/**
 * EMERGENCY CACHE KILLER - Load this FIRST
 * This script will forcefully clear all caches and reload
 */

(function() {
    'use strict';
    
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
        
        // Step 4: Clear localStorage
        try {
            localStorage.clear();
            console.log('✅ localStorage cleared');
            steps.push('localStorage: Cleared');
        } catch (e) {
            console.error('localStorage error:', e);
        }
        
        // Step 5: Clear sessionStorage
        try {
            sessionStorage.clear();
            console.log('✅ sessionStorage cleared');
            steps.push('sessionStorage: Cleared');
        } catch (e) {
            console.error('sessionStorage error:', e);
        }
        
        console.log('%c✅ CACHE CLEAR COMPLETE!', 'color: green; font-size: 18px; font-weight: bold;');
        console.log('Steps completed:', steps);
        
        // Show user notification
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
                Reloading in 3 seconds...
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
        
        // Force reload after 3 seconds
        setTimeout(() => {
            console.log('%c🔄 FORCING HARD RELOAD...', 'color: blue; font-size: 16px;');
            window.location.reload(true);
        }, 3000);
    }
    
    // Run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emergencyCacheClear);
    } else {
        emergencyCacheClear();
    }
    
})();
