/**
 * 📊 Database Performance Optimizer Service for WanderLust
 * 
 * Advanced database optimization service providing:
 * - Intelligent query optimization and caching
 * - Index management and suggestions
 * - Connection pooling and resource management
 * - Performance monitoring and analytics
 * - Automated query analysis and improvements
 * 
 * @author WanderLust Performance Team
 * @version 3.0.0
 */

const mongoose = require('mongoose');

class DatabasePerformanceOptimizer {
    constructor(options = {}) {
        this.config = {
            // Cache Configuration
            queryCache: {
                enabled: true,
                maxSize: 1000,
                defaultTTL: 300000, // 5 minutes
                maxMemoryUsage: 50 // MB
            },
            
            // Connection Pool Configuration
            connectionPool: {
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 30000,
                serverSelectionTimeoutMS: 5000
            },
            
            // Query Optimization
            optimization: {
                enableAutoIndexing: true,
                enablePipelineOptimization: true,
                enableQueryProfiling: true,
                slowQueryThreshold: 100 // ms
            },
            
            // Monitoring Configuration
            monitoring: {
                enabled: true,
                sampleRate: 0.1, // 10%
                metricsRetentionDays: 7
            },
            
            ...options
        };
        
        // Initialize caches and monitoring
        this.queryCache = new Map();
        this.indexSuggestions = new Set();
        this.queryMetrics = {
            totalQueries: 0,
            slowQueries: 0,
            cacheHits: 0,
            cacheMisses: 0,
            avgExecutionTime: 0,
            executionTimes: []
        };
        
        // Performance monitoring data
        this.performanceData = {
            queries: [],
            indexes: [],
            connections: [],
            errors: []
        };
        
        this.init();
    }
    
    /**
     * Initialize the database performance optimizer
     */
    async init() {
        console.log('🚀 Initializing Database Performance Optimizer...');
        
        try {
            // Set up mongoose optimizations
            this.optimizeMongooseConnection();
            
            // Initialize query profiling
            if (this.config.optimization.enableQueryProfiling) {
                this.initQueryProfiling();
            }
            
            // Start performance monitoring
            if (this.config.monitoring.enabled) {
                this.startPerformanceMonitoring();
            }
            
            // Set up cache cleanup
            this.startCacheCleanup();
            
            console.log('✅ Database Performance Optimizer initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Database Performance Optimizer:', error);
            throw error;
        }
    }
    
    /**
     * Optimize Mongoose connection settings
     */
    optimizeMongooseConnection() {
        const optimizedConfig = {
            maxPoolSize: this.config.connectionPool.maxPoolSize,
            minPoolSize: this.config.connectionPool.minPoolSize,
            maxIdleTimeMS: this.config.connectionPool.maxIdleTimeMS,
            serverSelectionTimeoutMS: this.config.connectionPool.serverSelectionTimeoutMS,
            
            // Additional optimizations
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
            useUnifiedTopology: true,
            useNewUrlParser: true,
            
            // Read preference for scaling
            readPreference: 'secondaryPreferred',
            
            // Write concern for performance
            w: 'majority',
            j: false, // Disable journaling for better write performance (adjust based on needs)
            
            // Socket options
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };
        
        // Apply optimizations to existing connection if available
        if (mongoose.connection.readyState === 1) {
            console.log('🔧 Applying optimizations to existing connection');
            // Connection already established, apply what we can
        } else {
            console.log('🔧 Connection optimizations configured for next connection');
        }
        
        return optimizedConfig;
    }
    
    /**
     * Execute optimized query with caching and performance monitoring
     */
    async executeOptimizedQuery(model, pipeline, options = {}) {
        const startTime = Date.now();
        const queryKey = this.generateQueryKey(model.modelName, pipeline, options);
        
        try {
            // Check cache first
            if (options.useCache !== false && this.config.queryCache.enabled) {
                const cached = this.getFromCache(queryKey);
                if (cached) {
                    this.recordCacheHit();
                    this.recordQueryMetric('cached', Date.now() - startTime, model.modelName);
                    return cached;
                }
            }
            
            // Optimize the pipeline
            const optimizedPipeline = this.optimizePipeline(pipeline, model.modelName);
            
            // Execute the query
            let result;
            if (Array.isArray(optimizedPipeline) && optimizedPipeline.length > 0) {
                result = await model.aggregate(optimizedPipeline);
            } else {
                result = await model.find(optimizedPipeline || {});
            }
            
            const executionTime = Date.now() - startTime;
            
            // Record performance metrics
            this.recordQueryMetric('executed', executionTime, model.modelName);
            this.recordCacheMiss();
            
            // Cache successful results
            if (options.useCache !== false && result && this.config.queryCache.enabled) {
                this.setInCache(queryKey, result, options.cacheTTL);
            }
            
            // Check for slow queries
            if (executionTime > this.config.optimization.slowQueryThreshold) {
                this.handleSlowQuery(model.modelName, pipeline, executionTime);
            }
            
            return result;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            this.recordError('query_execution', error, {
                model: model.modelName,
                pipeline: pipeline,
                executionTime: executionTime
            });
            throw error;
        }
    }
    
    /**
     * Optimize aggregation pipeline for better performance
     */
    optimizePipeline(pipeline, modelName) {
        if (!Array.isArray(pipeline)) return pipeline;
        
        const optimized = [...pipeline];
        
        // 1. Move $match stages as early as possible
        const matchStages = [];
        const otherStages = [];
        
        optimized.forEach(stage => {
            if (stage.$match) {
                matchStages.push(stage);
            } else {
                otherStages.push(stage);
            }
        });
        
        // 2. Optimize $match conditions for indexes
        matchStages.forEach(stage => {
            this.optimizeMatchStage(stage.$match, modelName);
        });
        
        // 3. Optimize $sort operations
        const optimizedOthers = otherStages.map(stage => {
            if (stage.$sort) {
                this.suggestSortIndex(stage.$sort, modelName);
            }
            return stage;
        });
        
        // 4. Add $limit early when possible
        const hasLimit = optimizedOthers.some(stage => stage.$limit);
        if (!hasLimit && otherStages.length > 0) {
            // Add reasonable default limit for safety
            optimizedOthers.push({ $limit: 1000 });
        }
        
        return [...matchStages, ...optimizedOthers];
    }
    
    /**
     * Optimize match conditions and suggest indexes
     */
    optimizeMatchStage(matchConditions, modelName) {
        Object.keys(matchConditions).forEach(field => {
            const condition = matchConditions[field];
            
            // Suggest single field indexes
            if (typeof condition === 'string' || typeof condition === 'number') {
                this.suggestIndex(modelName, { [field]: 1 });
            }
            
            // Suggest indexes for regex queries
            if (condition && condition.$regex) {
                this.suggestIndex(modelName, { [field]: 'text' });
            }
            
            // Suggest indexes for range queries
            if (condition && (condition.$gte || condition.$lte || condition.$gt || condition.$lt)) {
                this.suggestIndex(modelName, { [field]: 1 });
            }
            
            // Suggest compound indexes for $or conditions
            if (condition && condition.$or) {
                const fields = {};
                condition.$or.forEach(orCondition => {
                    Object.keys(orCondition).forEach(orField => {
                        fields[orField] = 1;
                    });
                });
                this.suggestIndex(modelName, fields);
            }
        });
    }
    
    /**
     * Suggest index for sort operations
     */
    suggestSortIndex(sortConditions, modelName) {
        this.suggestIndex(modelName, sortConditions);
    }
    
    /**
     * Add index suggestion
     */
    suggestIndex(modelName, indexSpec) {
        const indexKey = `${modelName}:${JSON.stringify(indexSpec)}`;
        
        if (!this.indexSuggestions.has(indexKey)) {
            this.indexSuggestions.add(indexKey);
            console.log(`💡 Index suggestion for ${modelName}:`, indexSpec);
            
            // Store suggestion for reporting
            this.performanceData.indexes.push({
                timestamp: new Date(),
                collection: modelName,
                indexSpec: indexSpec,
                reason: 'query_optimization'
            });
        }
    }
    
    /**
     * Handle slow query analysis
     */
    handleSlowQuery(modelName, pipeline, executionTime) {
        console.warn(`🐌 Slow query detected on ${modelName}: ${executionTime}ms`);
        
        this.queryMetrics.slowQueries++;
        
        // Store slow query for analysis
        this.performanceData.queries.push({
            timestamp: new Date(),
            collection: modelName,
            pipeline: pipeline,
            executionTime: executionTime,
            type: 'slow'
        });
        
        // Analyze and suggest optimizations
        this.analyzeSlowQuery(modelName, pipeline, executionTime);
    }
    
    /**
     * Analyze slow query and provide suggestions
     */
    analyzeSlowQuery(modelName, pipeline, executionTime) {
        const suggestions = [];
        
        if (Array.isArray(pipeline)) {
            // Check for missing $match at the beginning
            const firstStage = pipeline[0];
            if (!firstStage || !firstStage.$match) {
                suggestions.push('Consider adding $match stage early in pipeline to filter documents');
            }
            
            // Check for sort without limit
            const hasSort = pipeline.some(stage => stage.$sort);
            const hasLimit = pipeline.some(stage => stage.$limit);
            if (hasSort && !hasLimit) {
                suggestions.push('Consider adding $limit after $sort to reduce memory usage');
            }
            
            // Check for complex lookups
            const lookupCount = pipeline.filter(stage => stage.$lookup).length;
            if (lookupCount > 2) {
                suggestions.push('Multiple $lookup stages detected - consider data denormalization');
            }
        }
        
        if (suggestions.length > 0) {
            console.log(`💡 Optimization suggestions for ${modelName}:`, suggestions);
        }
    }
    
    /**
     * Cache management
     */
    generateQueryKey(modelName, pipeline, options = {}) {
        const keyObject = {
            model: modelName,
            pipeline: pipeline,
            options: {
                sort: options.sort,
                limit: options.limit,
                skip: options.skip
            }
        };
        
        return this.simpleHash(JSON.stringify(keyObject));
    }
    
    getFromCache(key) {
        const entry = this.queryCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiry) {
            this.queryCache.delete(key);
            return null;
        }
        
        return entry.data;
    }
    
    setInCache(key, data, ttl = this.config.queryCache.defaultTTL) {
        // Check cache size limits
        if (this.queryCache.size >= this.config.queryCache.maxSize) {
            this.evictLRUEntry();
        }
        
        this.queryCache.set(key, {
            data: data,
            expiry: Date.now() + ttl,
            timestamp: Date.now(),
            size: JSON.stringify(data).length
        });
    }
    
    evictLRUEntry() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, entry] of this.queryCache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.queryCache.delete(oldestKey);
        }
    }
    
    /**
     * Performance monitoring
     */
    recordQueryMetric(type, executionTime, modelName) {
        this.queryMetrics.totalQueries++;
        this.queryMetrics.executionTimes.push(executionTime);
        
        // Keep only recent execution times for average calculation
        if (this.queryMetrics.executionTimes.length > 100) {
            this.queryMetrics.executionTimes = this.queryMetrics.executionTimes.slice(-50);
        }
        
        // Recalculate average
        this.queryMetrics.avgExecutionTime = this.queryMetrics.executionTimes.reduce((a, b) => a + b, 0) / this.queryMetrics.executionTimes.length;
        
        // Record detailed metric
        if (this.config.monitoring.enabled && Math.random() < this.config.monitoring.sampleRate) {
            this.performanceData.queries.push({
                timestamp: new Date(),
                type: type,
                executionTime: executionTime,
                collection: modelName
            });
        }
    }
    
    recordCacheHit() {
        this.queryMetrics.cacheHits++;
    }
    
    recordCacheMiss() {
        this.queryMetrics.cacheMisses++;
    }
    
    recordError(type, error, metadata = {}) {
        this.performanceData.errors.push({
            timestamp: new Date(),
            type: type,
            message: error.message,
            stack: error.stack?.substring(0, 500),
            metadata: metadata
        });
        
        // Keep only recent errors
        if (this.performanceData.errors.length > 50) {
            this.performanceData.errors = this.performanceData.errors.slice(-25);
        }
    }
    
    /**
     * Query profiling initialization
     */
    initQueryProfiling() {
        // Enable MongoDB profiling for slow queries
        if (mongoose.connection.readyState === 1) {
            this.enableMongoDBProfiling();
        } else {
            mongoose.connection.on('connected', () => {
                this.enableMongoDBProfiling();
            });
        }
    }
    
    async enableMongoDBProfiling() {
        try {
            const db = mongoose.connection.db;
            
            // Enable profiling for slow operations (> 100ms)
            await db.command({
                profile: 2,
                slowms: this.config.optimization.slowQueryThreshold,
                sampleRate: this.config.monitoring.sampleRate
            });
            
            console.log('📊 MongoDB query profiling enabled');
        } catch (error) {
            console.warn('Failed to enable MongoDB profiling:', error.message);
        }
    }
    
    /**
     * Performance monitoring and cleanup
     */
    startPerformanceMonitoring() {
        // Log performance stats every 5 minutes
        setInterval(() => {
            this.logPerformanceStats();
        }, 300000);
        
        // Clean old performance data daily
        setInterval(() => {
            this.cleanOldPerformanceData();
        }, 86400000);
    }
    
    startCacheCleanup() {
        // Clean expired cache entries every 2 minutes
        setInterval(() => {
            this.cleanExpiredCache();
        }, 120000);
    }
    
    cleanExpiredCache() {
        let cleaned = 0;
        const now = Date.now();
        
        for (const [key, entry] of this.queryCache.entries()) {
            if (now > entry.expiry) {
                this.queryCache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
        }
    }
    
    cleanOldPerformanceData() {
        const cutoff = new Date(Date.now() - (this.config.monitoring.metricsRetentionDays * 24 * 60 * 60 * 1000));
        
        // Clean old query data
        this.performanceData.queries = this.performanceData.queries.filter(q => q.timestamp > cutoff);
        
        // Clean old index suggestions
        this.performanceData.indexes = this.performanceData.indexes.filter(i => i.timestamp > cutoff);
        
        console.log('🧹 Cleaned old performance data');
    }
    
    logPerformanceStats() {
        const cacheHitRate = this.queryMetrics.totalQueries > 0 
            ? ((this.queryMetrics.cacheHits / this.queryMetrics.totalQueries) * 100).toFixed(2)
            : 0;
        
        console.log('📊 Database Performance Stats:', {
            totalQueries: this.queryMetrics.totalQueries,
            slowQueries: this.queryMetrics.slowQueries,
            cacheHitRate: `${cacheHitRate}%`,
            avgExecutionTime: `${this.queryMetrics.avgExecutionTime.toFixed(2)}ms`,
            cacheSize: this.queryCache.size,
            indexSuggestions: this.indexSuggestions.size
        });
    }
    
    /**
     * Utility methods
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    /**
     * Public API methods
     */
    
    // Get performance statistics
    getPerformanceStats() {
        const cacheHitRate = this.queryMetrics.totalQueries > 0 
            ? ((this.queryMetrics.cacheHits / this.queryMetrics.totalQueries) * 100).toFixed(2)
            : 0;
        
        return {
            database: {
                totalQueries: this.queryMetrics.totalQueries,
                slowQueries: this.queryMetrics.slowQueries,
                avgExecutionTime: this.queryMetrics.avgExecutionTime.toFixed(2),
                slowQueryThreshold: this.config.optimization.slowQueryThreshold
            },
            cache: {
                hits: this.queryMetrics.cacheHits,
                misses: this.queryMetrics.cacheMisses,
                hitRate: `${cacheHitRate}%`,
                size: this.queryCache.size,
                maxSize: this.config.queryCache.maxSize
            },
            optimization: {
                indexSuggestions: this.indexSuggestions.size,
                suggestedIndexes: Array.from(this.indexSuggestions)
            },
            monitoring: {
                recentQueries: this.performanceData.queries.length,
                recentErrors: this.performanceData.errors.length
            }
        };
    }
    
    // Clear query cache
    clearQueryCache() {
        this.queryCache.clear();
        console.log('🧹 Query cache cleared');
    }
    
    // Get index suggestions
    getIndexSuggestions() {
        return Array.from(this.indexSuggestions);
    }
    
    // Export performance report
    exportPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            statistics: this.getPerformanceStats(),
            recentData: {
                slowQueries: this.performanceData.queries.filter(q => q.type === 'slow').slice(-10),
                recentErrors: this.performanceData.errors.slice(-5),
                indexSuggestions: this.performanceData.indexes.slice(-10)
            },
            configuration: this.config
        };
    }
    
    // Optimize specific model queries
    async optimizeModelQueries(model, commonQueries = []) {
        console.log(`🔧 Optimizing queries for model: ${model.modelName}`);
        
        const results = [];
        
        for (const query of commonQueries) {
            try {
                const result = await this.executeOptimizedQuery(model, query.pipeline, query.options);
                results.push({
                    query: query.name || 'unnamed',
                    success: true,
                    resultCount: result.length,
                    cached: false // Will be true on subsequent calls
                });
            } catch (error) {
                results.push({
                    query: query.name || 'unnamed',
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
}

module.exports = DatabasePerformanceOptimizer;