/**
 * Offline Manager for WanderLust Trip Plans
 * Handles caching trip data using IndexedDB for offline access
 * Provides functions for saving, retrieving, and syncing trip data
 */

(function() {
    class OfflineManager {
        constructor() {
            this.dbName = 'WanderLustOfflineDB';
            this.dbVersion = 1;
            this.db = null;
            this.initDB();
        }

        /**
         * Initialize IndexedDB database
         */
        async initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create trips store
                    if (!db.objectStoreNames.contains('trips')) {
                        const tripsStore = db.createObjectStore('trips', { keyPath: '_id' });
                        tripsStore.createIndex('userId', 'userId', { unique: false });
                        tripsStore.createIndex('destination', 'destination', { unique: false });
                        tripsStore.createIndex('createdAt', 'createdAt', { unique: false });
                        tripsStore.createIndex('isSynced', 'isSynced', { unique: false });
                    }

                    // Create sync queue store for pending changes
                    if (!db.objectStoreNames.contains('syncQueue')) {
                        const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
                        syncQueueStore.createIndex('type', 'type', { unique: false });
                        syncQueueStore.createIndex('tripId', 'tripId', { unique: false });
                        syncQueueStore.createIndex('status', 'status', { unique: false });
                        syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }

                    // Create metadata store
                    if (!db.objectStoreNames.contains('metadata')) {
                        const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
                        metadataStore.createIndex('value', 'value', { unique: false });
                    }
                };
            });
        }

        /**
         * Save trip data for offline access
         * @param {Object} tripData - Trip object to cache
         * @param {string} userId - User ID for ownership
         */
        async saveTripForOffline(tripData, userId = null) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips'], 'readwrite');
                const store = transaction.objectStore('trips');
                
                // Enhance trip data with offline metadata
                const offlineTrip = {
                    ...tripData,
                    userId: userId || tripData.userId,
                    isOffline: true,
                    cachedAt: new Date().toISOString(),
                    isSynced: true, // Initially synced when downloaded
                    lastAccessed: new Date().toISOString()
                };

                const request = store.put(offlineTrip);

                request.onsuccess = () => {
                    console.log('Trip saved for offline access:', offlineTrip._id);
                    resolve(offlineTrip);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Get all offline trips for a user
         * @param {string} userId - User ID to filter trips
         * @returns {Array} Array of offline trips
         */
        async getOfflineTrips(userId = null) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips'], 'readonly');
                const store = transaction.objectStore('trips');
                const index = userId ? store.index('userId') : store;
                const request = userId ? 
                    index.getAll(userId) : 
                    store.getAll(IDBKeyRange.bound({}, {}));

                request.onsuccess = () => {
                    const trips = request.result || [];
                    // Sort by last accessed (most recent first)
                    trips.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
                    resolve(trips);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Get a specific offline trip by ID
         * @param {string} tripId - Trip ID
         * @returns {Object} Trip data or null
         */
        async getOfflineTrip(tripId) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips'], 'readonly');
                const store = transaction.objectStore('trips');
                const request = store.get(tripId);

                request.onsuccess = () => {
                    const trip = request.result;
                    if (trip) {
                        // Update last accessed time
                        trip.lastAccessed = new Date().toISOString();
                        this.updateTrip(trip);
                    }
                    resolve(trip);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Update an offline trip (e.g., mark as accessed)
         * @param {Object} trip - Updated trip data
         */
        async updateTrip(trip) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips'], 'readwrite');
                const store = transaction.objectStore('trips');
                const request = store.put(trip);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Delete an offline trip
         * @param {string} tripId - Trip ID to delete
         */
        async deleteOfflineTrip(tripId) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips'], 'readwrite');
                const store = transaction.objectStore('trips');
                const request = store.delete(tripId);

                request.onsuccess = () => {
                    console.log('Offline trip deleted:', tripId);
                    resolve(true);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Add item to sync queue for later synchronization
         * @param {string} type - Type of operation (update, delete, etc.)
         * @param {Object} data - Data for the operation
         * @param {string} tripId - Associated trip ID
         */
        async addToSyncQueue(type, data, tripId = null) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['syncQueue'], 'readwrite');
                const store = transaction.objectStore('syncQueue');
                
                const syncItem = {
                    type,
                    data: JSON.stringify(data), // Store as string to avoid serialization issues
                    tripId,
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    retries: 0
                };

                const request = store.add(syncItem);

                request.onsuccess = () => {
                    console.log('Added to sync queue:', syncItem);
                    resolve(syncItem);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Get pending sync items
         * @returns {Array} Array of pending sync operations
         */
        async getPendingSyncItems() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['syncQueue'], 'readonly');
                const store = transaction.objectStore('syncQueue');
                const index = store.index('status');
                const request = index.getAll('pending');

                request.onsuccess = () => {
                    const items = request.result || [];
                    // Parse data back to objects
                    const parsedItems = items.map(item => ({
                        ...item,
                        data: JSON.parse(item.data)
                    }));
                    resolve(parsedItems);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Mark sync item as completed
         * @param {string} syncId - Sync item ID
         */
        async markSyncCompleted(syncId) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['syncQueue'], 'readwrite');
                const store = transaction.objectStore('syncQueue');
                const request = store.get(syncId);

                request.onsuccess = () => {
                    const item = request.result;
                    if (item) {
                        item.status = 'completed';
                        item.completedAt = new Date().toISOString();
                        store.put(item);
                    }
                    resolve(item);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Mark sync item as failed with retry
         * @param {string} syncId - Sync item ID
         */
        async markSyncFailed(syncId, error) {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['syncQueue'], 'readwrite');
                const store = transaction.objectStore('syncQueue');
                const request = store.get(syncId);

                request.onsuccess = () => {
                    const item = request.result;
                    if (item) {
                        item.status = 'failed';
                        item.retries += 1;
                        item.lastError = error;
                        item.lastAttempt = new Date().toISOString();
                        // If too many retries, mark as failed permanently
                        if (item.retries >= 3) {
                            item.status = 'failed_permanent';
                        } else {
                            item.status = 'pending'; // Retry later
                        }
                        store.put(item);
                    }
                    resolve(item);
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Clear completed sync items (cleanup)
         */
        async clearCompletedSyncs() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['syncQueue'], 'readwrite');
                const store = transaction.objectStore('syncQueue');
                const index = store.index('status');
                const request = index.openCursor(IDBKeyRange.only('completed'));

                const toDelete = [];
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        toDelete.push(cursor.value.id);
                        cursor.continue();
                    } else {
                        // Delete all completed items
                        toDelete.forEach(id => store.delete(id));
                        resolve(toDelete.length);
                    }
                };

                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Check if online and attempt to sync pending items
         */
        async syncOfflineChanges() {
            if (!navigator.onLine) {
                console.log('Offline - sync deferred');
                return false;
            }

            try {
                const pendingItems = await this.getPendingSyncItems();
                if (pendingItems.length === 0) {
                    console.log('No pending sync items');
                    return true;
                }

                console.log(`Syncing ${pendingItems.length} pending items...`);
                let syncSuccess = true;

                for (const item of pendingItems) {
                    try {
                        // Simulate API sync - in real implementation, call your backend APIs
                        await this.processSyncItem(item);
                        await this.markSyncCompleted(item.id);
                    } catch (error) {
                        console.error('Sync failed for item:', item.id, error);
                        await this.markSyncFailed(item.id, error.message);
                        syncSuccess = false;
                    }
                }

                if (syncSuccess) {
                    await this.clearCompletedSyncs();
                }

                return syncSuccess;
            } catch (error) {
                console.error('Sync error:', error);
                return false;
            }
        }

        /**
         * Process individual sync item (placeholder for API calls)
         * @param {Object} item - Sync queue item
         */
        async processSyncItem(item) {
            const data = item.data;
            
            switch (item.type) {
                case 'update':
                    // Call API to update trip
                    // await fetch(`/api/trips/${item.tripId}`, { method: 'PATCH', body: JSON.stringify(data) });
                    console.log('Updating trip:', item.tripId, data);
                    break;
                case 'delete':
                    // Call API to delete trip
                    // await fetch(`/api/trips/${item.tripId}`, { method: 'DELETE' });
                    console.log('Deleting trip:', item.tripId);
                    break;
                case 'create':
                    // Call API to create trip
                    // await fetch('/api/trips', { method: 'POST', body: JSON.stringify(data) });
                    console.log('Creating trip:', data);
                    break;
                default:
                    console.warn('Unknown sync type:', item.type);
            }

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        /**
         * Update offline trip and add to sync queue if needed
         * @param {Object} tripData - Updated trip data
         * @param {boolean} needsSync - Whether this change needs server sync
         */
        async updateOfflineTrip(tripData, needsSync = true) {
            await this.updateTrip(tripData);
            
            if (needsSync) {
                await this.addToSyncQueue('update', tripData, tripData._id);
            }
        }

        /**
         * Delete offline trip and add to sync queue
         * @param {string} tripId - Trip ID
         * @param {boolean} needsSync - Whether to queue for server deletion
         */
        async deleteOfflineTripWithSync(tripId, needsSync = true) {
            await this.deleteOfflineTrip(tripId);
            
            if (needsSync) {
                await this.addToSyncQueue('delete', { tripId }, tripId);
            }
        }

        /**
         * Get sync status summary
         * @returns {Object} Sync status info
         */
        async getSyncStatus() {
            if (!this.db) {
                await this.initDB();
            }

            const pendingItems = await this.getPendingSyncItems();
            const offlineTrips = await this.getOfflineTrips();

            return {
                pendingSyncs: pendingItems.length,
                offlineTrips: offlineTrips.length,
                isOnline: navigator.onLine,
                storageQuota: await this.getStorageUsage(),
                lastSync: await this.getLastSyncTime()
            };
        }

        /**
         * Get approximate storage usage
         */
        async getStorageUsage() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve) => {
                const transaction = this.db.transaction(['trips', 'syncQueue'], 'readonly');
                let totalSize = 0;

                ['trips', 'syncQueue'].forEach(storeName => {
                    const store = transaction.objectStore(storeName);
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const items = request.result;
                        items.forEach(item => {
                            totalSize += JSON.stringify(item).length;
                        });
                        if (storeName === 'syncQueue') {
                            resolve(totalSize);
                        }
                    };
                });
            });
        }

        /**
         * Get last sync time from metadata
         */
        async getLastSyncTime() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['metadata'], 'readonly');
                const store = transaction.objectStore('metadata');
                const request = store.get('lastSync');

                request.onsuccess = () => resolve(request.result?.value || null);
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Update last sync time
         */
        async updateLastSyncTime() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['metadata'], 'readwrite');
                const store = transaction.objectStore('metadata');
                const request = store.put({
                    key: 'lastSync',
                    value: new Date().toISOString()
                });

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        /**
         * Clear all offline data (for logout or reset)
         */
        async clearAllOfflineData() {
            if (!this.db) {
                await this.initDB();
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['trips', 'syncQueue', 'metadata'], 'readwrite');
                
                ['trips', 'syncQueue', 'metadata'].forEach(storeName => {
                    const store = transaction.objectStore(storeName);
                    store.clear();
                });

                transaction.oncomplete = () => {
                    console.log('All offline data cleared');
                    resolve();
                };

                transaction.onerror = () => reject(transaction.error);
            });
        }

        /**
         * Check storage quota and handle quota exceeded errors
         */
        async checkStorageQuota() {
            try {
                // Test write to check quota
                await this.addToSyncQueue('test', { test: true });
                // If successful, clean up test item
                const pending = await this.getPendingSyncItems();
                const testItem = pending.find(item => item.type === 'test');
                if (testItem) {
                    await this.markSyncCompleted(testItem.id);
                }
                return { quotaOk: true, available: true };
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    console.warn('Storage quota exceeded');
                    return { quotaOk: false, error: 'Storage quota exceeded' };
                }
                return { quotaOk: true, available: true };
            }
        }
    }

    // Make class available globally
    window.OfflineManagerClass = OfflineManager;
})();

// Initialize OfflineManager when DOM is loaded
let offlineManagerInstance;
document.addEventListener('DOMContentLoaded', () => {
    if (window.OfflineManagerClass) {
        offlineManagerInstance = new window.OfflineManagerClass();
        window.OfflineManager = offlineManagerInstance;
    }
});

// Auto-sync when back online
window.addEventListener('online', async () => {
    if (window.OfflineManager) {
        const success = await window.OfflineManager.syncOfflineChanges();
        if (success) {
            console.log('Offline changes synced successfully');
            // Trigger any UI updates for sync status
            document.dispatchEvent(new CustomEvent('offline-sync-completed'));
        }
    }
});

// Listen for visibility changes to update last accessed
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.OfflineManager) {
        // Update currently viewed trip as recently accessed
        const currentTripId = window.location.pathname.match(/\/my-trips\/([a-f0-9]+)/)?.[1];
        if (currentTripId) {
            window.OfflineManager.getOfflineTrip(currentTripId).catch(console.error);
        }
    }
});

// Export for module usage (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineManager;
}
