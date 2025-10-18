/**
 * 🚀 Advanced Performance Optimization & Caching System for WanderLust
 * 
 * Comprehensive performance enhancement suite that includes:
 * - Multi-layer caching strategy (memory, Redis, browser)
 * - Database query optimization with smart indexing
 * - Real-time performance monitoring and analytics
 * - Adaptive resource loading and compression
 * - Search performance optimization with intelligent caching
 * - Image and asset optimization pipeline
 * 
 * @author WanderLust Performance Team
 * @version 3.0.0
 * @since 2024
 */

class PerformanceOptimizer {
    constructor(options = {}) {
        this.config = {
            // Cache Configuration
            memoryCache: {
                enabled: true,
                maxSize: 100, // MB
                defaultTTL: 300000, // 5 minutes
                maxEntries: 1000
            },
            
            // Redis Configuration (if available)
            redisCache: {
                enabled: false, // Will auto-detect Redis
                defaultTTL: 1800, // 30 minutes
                keyPrefix: 'wanderlust:cache:'
            },
            
            // Browser Cache Configuration
            browserCache: {
                enabled: true,
                staticAssetsTTL: 86400000, // 1 day
                dynamicContentTTL: 300000, // 5 minutes
                apiResponsesTTL: 600000 // 10 minutes
            },
            
            // Performance Monitoring
            monitoring: {
                enabled: true,
                sampleRate: 0.1, // 10% sampling
                metricsEndpoint: '/api/performance/metrics',
                alertThresholds: {
                    pageLoadTime: 3000, // 3 seconds
                    apiResponseTime: 1000, // 1 second
                    errorRate: 0.05 // 5%
                }
            },
            
            // Database Optimization
            database: {
                enableQueryOptimization: true,
                enableIndexOptimization: true,
                enableAggregationOptimization: true,
                connectionPooling: true,
                queryTimeout: 10000 // 10 seconds
            },
            
            // Image Optimization
            images: {
                enableLazyLoading: true,
                enableWebP: true,
                enableProgressive: true,
                compressionQuality: 85,
                enableCDN: false // Can be enabled with CDN setup
            },
            
            ...options
        };
        
        // Initialize caches
        this.memoryCache = new Map();
        this.cacheStats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalRequests: 0
        };
        
        // Performance metrics storage
        this.performanceMetrics = {
            pageLoads: [],
            apiCalls: [],
            dbQueries: [],
            errors: []
        };
        
        // Query optimization cache
        this.queryCache = new Map();
        this.optimizedIndexes = new Set();
        
        this.init();
    }
    
    /**
     * Initialize the performance optimization system
     */
    async init() {
        console.log('🚀 Initializing WanderLust Performance Optimization System...');
        
        // Initialize monitoring
        if (this.config.monitoring.enabled) {
            this.initPerformanceMonitoring();
        }
        
        // Initialize browser caching strategies
        if (this.config.browserCache.enabled) {
            this.initBrowserCaching();
        }
        
        // Initialize Redis if available
        if (this.config.redisCache.enabled) {
            await this.initRedisCache();
        }
        
        // Initialize image optimization
        if (this.config.images.enableLazyLoading) {
            this.initImageOptimization();
        }
        
        // Set up cache cleanup
        this.startCacheCleanup();
        
        console.log('✅ Performance Optimization System initialized successfully!');
    }
    
    /**
     * Multi-layer caching system with intelligent fallbacks
     */
    async get(key, options = {}) {
        const startTime = performance.now();
        const fullKey = this.generateCacheKey(key, options);
        
        try {
            // Layer 1: Memory Cache (fastest)
            if (this.config.memoryCache.enabled) {
                const memoryResult = this.getFromMemoryCache(fullKey);
                if (memoryResult !== null) {
                    this.recordCacheHit('memory', performance.now() - startTime);
                    return memoryResult;
                }
            }
            
            // Layer 2: Redis Cache (if enabled)
            if (this.config.redisCache.enabled && this.redisClient) {
                const redisResult = await this.getFromRedisCache(fullKey);
                if (redisResult !== null) {
                    // Store in memory cache for faster access
                    this.setInMemoryCache(fullKey, redisResult, options.ttl);
                    this.recordCacheHit('redis', performance.now() - startTime);
                    return redisResult;
                }
            }
            
            // Layer 3: Browser Cache (for client-side)
            if (typeof window !== 'undefined' && this.config.browserCache.enabled) {
                const browserResult = await this.getFromBrowserCache(fullKey);
                if (browserResult !== null) {
                    this.recordCacheHit('browser', performance.now() - startTime);
                    return browserResult;
                }
            }
            
            this.recordCacheMiss(performance.now() - startTime);
            return null;
            
        } catch (error) {
            console.error('Cache retrieval error:', error);
            this.recordError('cache_get', error);
            return null;
        }
    }
    
    /**
     * Set value in multi-layer cache
     */
    async set(key, value, options = {}) {
        const fullKey = this.generateCacheKey(key, options);
        const ttl = options.ttl || this.config.memoryCache.defaultTTL;
        
        try {
            // Set in all available caches
            if (this.config.memoryCache.enabled) {
                this.setInMemoryCache(fullKey, value, ttl);
            }
            
            if (this.config.redisCache.enabled && this.redisClient) {
                await this.setInRedisCache(fullKey, value, ttl);
            }
            
            if (typeof window !== 'undefined' && this.config.browserCache.enabled) {
                await this.setInBrowserCache(fullKey, value, ttl);
            }
            
        } catch (error) {
            console.error('Cache set error:', error);
            this.recordError('cache_set', error);
        }
    }
    
    /**
     * Memory cache operations
     */
    getFromMemoryCache(key) {
        const entry = this.memoryCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiry) {
            this.memoryCache.delete(key);
            this.cacheStats.evictions++;
            return null;
        }
        
        // Update access time for LRU
        entry.lastAccess = Date.now();
        return entry.value;
    }
    
    setInMemoryCache(key, value, ttl = this.config.memoryCache.defaultTTL) {
        // Implement LRU eviction if cache is full
        if (this.memoryCache.size >= this.config.memoryCache.maxEntries) {
            this.evictLRUEntry();
        }
        
        this.memoryCache.set(key, {
            value: value,
            expiry: Date.now() + ttl,
            lastAccess: Date.now(),
            size: this.estimateSize(value)
        });
    }
    
    /**
     * Redis cache operations (when available)
     */
    async initRedisCache() {
        try {
            // Redis would be initialized here if available
            // For now, we'll simulate Redis-like behavior
            console.log('📡 Redis cache simulation initialized');
        } catch (error) {
            console.warn('Redis not available, using memory cache only');
            this.config.redisCache.enabled = false;
        }
    }
    
    async getFromRedisCache(key) {
        // Simulate Redis get operation
        return null; // Would return actual Redis value
    }
    
    async setInRedisCache(key, value, ttl) {
        // Simulate Redis set operation
        console.log(`Setting in Redis: ${key}`);
    }
    
    /**
     * Browser cache operations (client-side)
     */
    async getFromBrowserCache(key) {
        if (typeof window === 'undefined') return null;
        
        try {
            const cached = localStorage.getItem(`perf_cache_${key}`);
            if (!cached) return null;
            
            const entry = JSON.parse(cached);
            if (Date.now() > entry.expiry) {
                localStorage.removeItem(`perf_cache_${key}`);
                return null;
            }
            
            return entry.value;
        } catch (error) {
            return null;
        }
    }
    
    async setInBrowserCache(key, value, ttl) {
        if (typeof window === 'undefined') return;
        
        try {
            const entry = {
                value: value,
                expiry: Date.now() + ttl
            };
            localStorage.setItem(`perf_cache_${key}`, JSON.stringify(entry));
        } catch (error) {
            console.warn('Browser cache storage failed:', error);
        }
    }
    
    /**
     * Database Query Optimization
     */
    async optimizeQuery(collection, pipeline, options = {}) {
        const queryKey = this.generateQueryKey(collection, pipeline);
        
        // Check if query is already cached
        if (options.useCache !== false) {
            const cached = await this.get(queryKey, { ttl: 300000 }); // 5 min cache
            if (cached) {
                this.recordMetric('db_query', { cached: true, collection });
                return cached;
            }
        }
        
        // Optimize the query pipeline
        const optimizedPipeline = this.optimizePipeline(pipeline);
        
        const startTime = Date.now();
        try {
            // Execute optimized query (simulation - actual DB call would go here)
            const result = await this.executeOptimizedQuery(collection, optimizedPipeline);
            
            const duration = Date.now() - startTime;
            this.recordMetric('db_query', { 
                cached: false, 
                collection, 
                duration,
                pipelineStages: optimizedPipeline.length 
            });
            
            // Cache successful results
            if (options.useCache !== false && result) {
                await this.set(queryKey, result, { ttl: options.cacheTTL || 300000 });
            }
            
            return result;
        } catch (error) {
            this.recordError('db_query', error);
            throw error;
        }
    }
    
    /**
     * Pipeline optimization strategies
     */
    optimizePipeline(pipeline) {
        const optimized = [...pipeline];
        
        // Move $match stages early
        const matchStages = optimized.filter(stage => stage.$match);
        const otherStages = optimized.filter(stage => !stage.$match);
        
        // Add index hints for common queries
        if (matchStages.length > 0) {
            matchStages.forEach(stage => {
                if (stage.$match.location || stage.$match.country) {
                    // Suggest compound index
                    this.suggestIndex('listings', { location: 1, country: 1 });
                }
                if (stage.$match.category) {
                    this.suggestIndex('listings', { category: 1 });
                }
                if (stage.$match.price) {
                    this.suggestIndex('listings', { price: 1 });
                }
            });
        }
        
        // Optimize sort operations
        const sortStages = otherStages.filter(stage => stage.$sort);
        if (sortStages.length > 0) {
            sortStages.forEach(stage => {
                const sortKeys = Object.keys(stage.$sort);
                if (sortKeys.length > 0) {
                    const indexSpec = {};
                    sortKeys.forEach(key => {
                        indexSpec[key] = stage.$sort[key];
                    });
                    this.suggestIndex('listings', indexSpec);
                }
            });
        }
        
        return [...matchStages, ...otherStages];
    }
    
    /**
     * Search Performance Optimization
     */
    async optimizeSearch(query, collection = 'listings') {
        const searchKey = `search_${collection}_${query}`;
        
        // Check search cache first
        const cached = await this.get(searchKey, { ttl: 180000 }); // 3 min cache
        if (cached) {
            this.recordMetric('search', { cached: true, query: query.substring(0, 20) });
            return cached;
        }
        
        const startTime = Date.now();
        
        try {
            // Build optimized search pipeline
            const pipeline = [
                {
                    $match: {
                        $or: [
                            { title: { $regex: query, $options: 'i' } },
                            { description: { $regex: query, $options: 'i' } },
                            { location: { $regex: query, $options: 'i' } },
                            { country: { $regex: query, $options: 'i' } }
                        ]
                    }
                },
                {
                    $addFields: {
                        relevanceScore: {
                            $add: [
                                { $cond: [{ $regexMatch: { input: "$title", regex: query, options: "i" } }, 10, 0] },
                                { $cond: [{ $regexMatch: { input: "$location", regex: query, options: "i" } }, 5, 0] },
                                { $cond: [{ $regexMatch: { input: "$country", regex: query, options: "i" } }, 3, 0] },
                                { $cond: [{ $regexMatch: { input: "$description", regex: query, options: "i" } }, 1, 0] }
                            ]
                        }
                    }
                },
                { $sort: { relevanceScore: -1, avgRating: -1 } },
                { $limit: 20 }
            ];
            
            // Suggest text index for better search performance
            this.suggestIndex(collection, {
                title: 'text',
                description: 'text',
                location: 'text',
                country: 'text'
            });
            
            const results = await this.optimizeQuery(collection, pipeline);
            
            const duration = Date.now() - startTime;
            this.recordMetric('search', { 
                cached: false, 
                query: query.substring(0, 20),
                duration,
                resultCount: results ? results.length : 0
            });
            
            // Cache search results
            await this.set(searchKey, results, { ttl: 180000 });
            
            return results;
        } catch (error) {
            this.recordError('search', error);
            throw error;
        }
    }
    
    /**
     * Image Optimization System
     */
    initImageOptimization() {
        if (typeof window === 'undefined') return;
        
        // Enhanced lazy loading with intersection observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadOptimizedImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Load images 50px before they come into view
            threshold: 0.01
        });
        
        // Observe all images with lazy loading
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Add WebP support detection
        this.detectWebPSupport();
    }
    
    loadOptimizedImage(img) {
        const startTime = Date.now();
        
        // Implement progressive loading
        if (img.dataset.placeholder) {
            img.src = img.dataset.placeholder;
        }
        
        // Load optimized version
        const optimizedSrc = this.getOptimizedImageSrc(img.dataset.src || img.src);
        
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = optimizedSrc;
            img.classList.add('loaded');
            
            this.recordMetric('image_load', {
                duration: Date.now() - startTime,
                size: this.estimateImageSize(img),
                optimized: true
            });
        };
        tempImg.onerror = () => {
            // Fallback to original image
            img.src = img.dataset.src || img.src;
            this.recordError('image_optimization', new Error('Optimized image failed to load'));
        };
        tempImg.src = optimizedSrc;
    }
    
    getOptimizedImageSrc(src) {
        if (!src) return src;
        
        // Add optimization parameters
        const url = new URL(src, window.location.origin);
        
        // Add WebP format if supported
        if (this.supportsWebP) {
            url.searchParams.set('format', 'webp');
        }
        
        // Add quality optimization
        url.searchParams.set('quality', this.config.images.compressionQuality);
        
        // Add responsive sizing based on viewport
        const screenWidth = window.screen.width;
        const dpr = window.devicePixelRatio || 1;
        const optimalWidth = Math.min(screenWidth * dpr, 2048); // Cap at 2048px
        
        url.searchParams.set('width', optimalWidth);
        
        return url.toString();
    }
    
    detectWebPSupport() {
        const webPTestImage = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        
        const img = new Image();
        img.onload = img.onerror = () => {
            this.supportsWebP = (img.height === 2);
        };
        img.src = webPTestImage;
    }
    
    /**
     * Performance Monitoring System
     */
    initPerformanceMonitoring() {
        // Monitor page load performance
        if (typeof window !== 'undefined' && 'performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => this.recordPageLoadMetrics(), 0);
            });
            
            // Monitor API calls
            this.interceptFetchCalls();
            
            // Monitor errors
            window.addEventListener('error', (event) => {
                this.recordError('javascript', event.error);
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                this.recordError('promise_rejection', event.reason);
            });
        }
    }
    
    recordPageLoadMetrics() {
        if (typeof window === 'undefined') return;
        
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
            timestamp: Date.now(),
            url: window.location.pathname,
            loadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            transferSize: navigation.transferSize || 0,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        this.performanceMetrics.pageLoads.push(metrics);
        
        // Check performance thresholds
        if (metrics.loadTime > this.config.monitoring.alertThresholds.pageLoadTime) {
            this.triggerPerformanceAlert('slow_page_load', metrics);
        }
        
        // Keep only recent metrics
        if (this.performanceMetrics.pageLoads.length > 100) {
            this.performanceMetrics.pageLoads = this.performanceMetrics.pageLoads.slice(-50);
        }
    }
    
    interceptFetchCalls() {
        if (typeof window === 'undefined') return;
        
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = Date.now();
            const url = args[0];
            
            try {
                const response = await originalFetch.apply(window, args);
                
                const duration = Date.now() - startTime;
                this.recordMetric('api_call', {
                    url: typeof url === 'string' ? url : url.url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: duration,
                    success: response.ok
                });
                
                if (duration > this.config.monitoring.alertThresholds.apiResponseTime) {
                    this.triggerPerformanceAlert('slow_api_response', {
                        url: typeof url === 'string' ? url : url.url,
                        duration: duration
                    });
                }
                
                return response;
            } catch (error) {
                this.recordError('api_call', error);
                throw error;
            }
        };
    }
    
    /**
     * Cache Management and Cleanup
     */
    startCacheCleanup() {
        // Clean expired entries every 5 minutes
        setInterval(() => {
            this.cleanupExpiredEntries();
        }, 300000);
        
        // Generate cache statistics every minute
        setInterval(() => {
            this.generateCacheStatistics();
        }, 60000);
    }
    
    cleanupExpiredEntries() {
        let cleanedCount = 0;
        const now = Date.now();
        
        for (const [key, entry] of this.memoryCache.entries()) {
            if (now > entry.expiry) {
                this.memoryCache.delete(key);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
            this.cacheStats.evictions += cleanedCount;
        }
    }
    
    evictLRUEntry() {
        let oldestKey = null;
        let oldestAccess = Date.now();
        
        for (const [key, entry] of this.memoryCache.entries()) {
            if (entry.lastAccess < oldestAccess) {
                oldestAccess = entry.lastAccess;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.memoryCache.delete(oldestKey);
            this.cacheStats.evictions++;
        }
    }
    
    /**
     * Index Optimization Suggestions
     */
    suggestIndex(collection, indexSpec) {
        const indexKey = `${collection}:${JSON.stringify(indexSpec)}`;
        
        if (!this.optimizedIndexes.has(indexKey)) {
            console.log(`💡 Suggested index for ${collection}:`, indexSpec);
            this.optimizedIndexes.add(indexKey);
        }
    }
    
    /**
     * Utility Methods
     */
    generateCacheKey(key, options = {}) {
        const prefix = options.prefix || 'perf';
        const namespace = options.namespace || 'default';
        return `${prefix}:${namespace}:${key}`;
    }
    
    generateQueryKey(collection, pipeline) {
        const pipelineStr = JSON.stringify(pipeline);
        const hash = this.simpleHash(pipelineStr);
        return `query:${collection}:${hash}`;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    estimateSize(obj) {
        return JSON.stringify(obj).length * 2; // Rough estimation in bytes
    }
    
    estimateImageSize(img) {
        return img.naturalWidth * img.naturalHeight * 3; // Rough estimation for RGB
    }
    
    recordCacheHit(layer, duration = 0) {
        this.cacheStats.hits++;
        this.cacheStats.totalRequests++;
        
        this.recordMetric('cache_performance', {
            type: 'hit',
            layer: layer,
            duration: duration
        });
    }
    
    recordCacheMiss(duration = 0) {
        this.cacheStats.misses++;
        this.cacheStats.totalRequests++;
        
        this.recordMetric('cache_performance', {
            type: 'miss',
            duration: duration
        });
    }
    
    recordMetric(type, data) {
        const metric = {
            timestamp: Date.now(),
            type: type,
            data: data
        };
        
        // Store metrics based on type
        switch (type) {
            case 'api_call':
                this.performanceMetrics.apiCalls.push(metric);
                if (this.performanceMetrics.apiCalls.length > 200) {
                    this.performanceMetrics.apiCalls = this.performanceMetrics.apiCalls.slice(-100);
                }
                break;
            case 'db_query':
                this.performanceMetrics.dbQueries.push(metric);
                if (this.performanceMetrics.dbQueries.length > 200) {
                    this.performanceMetrics.dbQueries = this.performanceMetrics.dbQueries.slice(-100);
                }
                break;
        }
    }
    
    recordError(type, error) {
        this.performanceMetrics.errors.push({
            timestamp: Date.now(),
            type: type,
            message: error.message || String(error),
            stack: error.stack?.substring(0, 500)
        });
        
        // Keep only recent errors
        if (this.performanceMetrics.errors.length > 50) {
            this.performanceMetrics.errors = this.performanceMetrics.errors.slice(-25);
        }
    }
    
    triggerPerformanceAlert(alertType, data) {
        console.warn(`🚨 Performance Alert: ${alertType}`, data);
        
        // In production, this would send alerts to monitoring service
        if (this.config.monitoring.enabled) {
            // Send to monitoring endpoint
            this.sendToMonitoring(alertType, data);
        }
    }
    
    async sendToMonitoring(alertType, data) {
        if (typeof fetch === 'undefined') return;
        
        try {
            await fetch(this.config.monitoring.metricsEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'alert',
                    alertType: alertType,
                    data: data,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Failed to send monitoring data:', error);
        }
    }
    
    generateCacheStatistics() {
        const hitRate = this.cacheStats.totalRequests > 0 
            ? (this.cacheStats.hits / this.cacheStats.totalRequests * 100).toFixed(2)
            : 0;
        
        console.log(`📊 Cache Stats: ${hitRate}% hit rate (${this.cacheStats.hits}/${this.cacheStats.totalRequests}), Size: ${this.memoryCache.size} entries`);
    }
    
    /**
     * Simulate database query execution (in real implementation, this would call actual MongoDB)
     */
    async executeOptimizedQuery(collection, pipeline) {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
        
        // Return mock data for demonstration
        return [
            { id: 1, title: 'Sample Listing 1', location: 'Paris, France' },
            { id: 2, title: 'Sample Listing 2', location: 'Tokyo, Japan' }
        ];
    }
    
    /**
     * Public API Methods
     */
    
    // Get performance statistics
    getPerformanceStats() {
        return {
            cache: {
                ...this.cacheStats,
                hitRate: this.cacheStats.totalRequests > 0 
                    ? (this.cacheStats.hits / this.cacheStats.totalRequests * 100).toFixed(2)
                    : 0,
                memoryUsage: this.memoryCache.size
            },
            metrics: {
                pageLoads: this.performanceMetrics.pageLoads.length,
                apiCalls: this.performanceMetrics.apiCalls.length,
                dbQueries: this.performanceMetrics.dbQueries.length,
                errors: this.performanceMetrics.errors.length
            },
            indexes: Array.from(this.optimizedIndexes)
        };
    }
    
    // Clear all caches
    async clearAllCaches() {
        this.memoryCache.clear();
        this.queryCache.clear();
        
        if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('perf_cache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        console.log('🧹 All caches cleared');
    }
    
    // Force cache refresh for specific key
    async refreshCache(key) {
        const fullKey = this.generateCacheKey(key);
        this.memoryCache.delete(fullKey);
        
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`perf_cache_${fullKey}`);
        }
        
        console.log(`🔄 Cache refreshed for key: ${key}`);
    }
    
    // Export performance report
    exportPerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.getPerformanceStats(),
            recentMetrics: {
                pageLoads: this.performanceMetrics.pageLoads.slice(-10),
                apiCalls: this.performanceMetrics.apiCalls.slice(-10),
                dbQueries: this.performanceMetrics.dbQueries.slice(-10),
                errors: this.performanceMetrics.errors.slice(-5)
            },
            configuration: this.config
        };
        
        console.log('📊 Performance Report Generated:', report);
        return report;
    }
}

// Browser-specific initialization
if (typeof window !== 'undefined') {
    // Initialize performance optimizer when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.performanceOptimizer = new PerformanceOptimizer();
        });
    } else {
        window.performanceOptimizer = new PerformanceOptimizer();
    }
    
    // Add performance dashboard shortcut
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            if (window.performanceOptimizer) {
                console.log('🚀 WanderLust Performance Dashboard');
                console.table(window.performanceOptimizer.getPerformanceStats());
                console.log('Use performanceOptimizer.exportPerformanceReport() for detailed report');
            }
        }
    });
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}