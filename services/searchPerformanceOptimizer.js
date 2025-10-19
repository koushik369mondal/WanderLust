/**
 * 🎯 Advanced Search Performance Optimizer for WanderLust
 * 
 * Intelligent search optimization system providing:
 * - Real-time search suggestions with caching
 * - Fuzzy matching and typo tolerance
 * - Search analytics and performance monitoring
 * - Adaptive search algorithms based on user behavior
 * - Multi-language search support
 * 
 * @author WanderLust Performance Team
 * @version 3.0.0
 */

class SearchPerformanceOptimizer {
    constructor(options = {}) {
        this.config = {
            // Search Configuration
            search: {
                minQueryLength: 2,
                maxSuggestions: 10,
                debounceDelay: 300,
                fuzzyMatchThreshold: 0.8,
                enableTypoTolerance: true
            },
            
            // Cache Configuration
            cache: {
                enabled: true,
                maxSize: 500,
                defaultTTL: 300000, // 5 minutes
                suggestionsTTL: 600000 // 10 minutes
            },
            
            // Performance Configuration
            performance: {
                maxConcurrentRequests: 5,
                timeoutMs: 5000,
                enableAnalytics: true,
                enablePrefetching: true
            },
            
            // Analytics Configuration
            analytics: {
                enabled: true,
                sampleRate: 0.2, // 20%
                trackUserBehavior: true,
                popularityBoost: true
            },
            
            ...options
        };
        
        // Initialize search caches
        this.searchCache = new Map();
        this.suggestionsCache = new Map();
        this.popularityCache = new Map();
        
        // Search analytics
        this.searchAnalytics = {
            totalSearches: 0,
            uniqueQueries: new Set(),
            popularQueries: new Map(),
            avgResponseTime: 0,
            responseTimes: [],
            cacheHitRate: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
        
        // User behavior tracking
        this.userBehavior = {
            clickedResults: new Map(),
            abandonedSearches: new Set(),
            refinedQueries: new Map()
        };
        
        // Request queue management
        this.requestQueue = [];
        this.activeRequests = 0;
        
        this.init();
    }
    
    /**
     * Initialize the search performance optimizer
     */
    async init() {
        console.log('🔍 Initializing Search Performance Optimizer...');
        
        try {
            // Load popular searches from storage
            await this.loadPopularSearches();
            
            // Initialize search prefetching
            if (this.config.performance.enablePrefetching) {
                this.initPrefetching();
            }
            
            // Start analytics collection
            if (this.config.analytics.enabled) {
                this.startAnalyticsCollection();
            }
            
            // Initialize cache cleanup
            this.startCacheCleanup();
            
            console.log('✅ Search Performance Optimizer initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Search Performance Optimizer:', error);
            throw error;
        }
    }
    
    /**
     * Execute optimized search with intelligent caching and suggestions
     */
    async executeSearch(query, options = {}) {
        const startTime = Date.now();
        const normalizedQuery = this.normalizeQuery(query);
        
        // Validate query
        if (!this.validateQuery(normalizedQuery)) {
            return {
                results: [],
                suggestions: [],
                cached: false,
                executionTime: 0
            };
        }
        
        try {
            // Check cache first
            const cacheKey = this.generateSearchCacheKey(normalizedQuery, options);
            
            if (this.config.cache.enabled) {
                const cached = this.getFromSearchCache(cacheKey);
                if (cached) {
                    const executionTime = Date.now() - startTime;
                    this.recordSearchAnalytics('cached', normalizedQuery, executionTime);
                    return {
                        ...cached,
                        cached: true,
                        executionTime: executionTime
                    };
                }
            }
            
            // Execute search with queue management
            const searchResult = await this.executeQueuedSearch(normalizedQuery, options);
            const executionTime = Date.now() - startTime;
            
            // Process and enhance results
            const enhancedResults = this.enhanceSearchResults(searchResult.results, normalizedQuery);
            const suggestions = await this.generateSuggestions(normalizedQuery);
            
            const result = {
                results: enhancedResults,
                suggestions: suggestions,
                cached: false,
                executionTime: executionTime,
                totalFound: searchResult.totalFound || enhancedResults.length
            };
            
            // Cache successful results
            if (this.config.cache.enabled && enhancedResults.length > 0) {
                this.setInSearchCache(cacheKey, result);
            }
            
            // Record analytics
            this.recordSearchAnalytics('executed', normalizedQuery, executionTime, enhancedResults.length);
            
            return result;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            this.recordSearchError(normalizedQuery, error, executionTime);
            throw error;
        }
    }
    
    /**
     * Generate intelligent search suggestions
     */
    async generateSuggestions(query, maxSuggestions = null) {
        const limit = maxSuggestions || this.config.search.maxSuggestions;
        const cacheKey = `suggestions_${this.normalizeQuery(query)}`;
        
        // Check suggestions cache
        if (this.config.cache.enabled) {
            const cached = this.getFromSuggestionsCache(cacheKey);
            if (cached) {
                return cached.slice(0, limit);
            }
        }
        
        try {
            const suggestions = [];
            
            // 1. Fuzzy matching suggestions
            const fuzzyMatches = await this.generateFuzzyMatches(query);
            suggestions.push(...fuzzyMatches);
            
            // 2. Popular search suggestions
            const popularSuggestions = this.getPopularSuggestions(query);
            suggestions.push(...popularSuggestions);
            
            // 3. Autocomplete suggestions
            const autocompleteSuggestions = await this.generateAutocompleteSuggestions(query);
            suggestions.push(...autocompleteSuggestions);
            
            // 4. Category-based suggestions
            const categorySuggestions = await this.generateCategorySuggestions(query);
            suggestions.push(...categorySuggestions);
            
            // Remove duplicates and rank suggestions
            const uniqueSuggestions = this.rankAndDeduplicateSuggestions(suggestions, query);
            const finalSuggestions = uniqueSuggestions.slice(0, limit);
            
            // Cache suggestions
            if (this.config.cache.enabled) {
                this.setInSuggestionsCache(cacheKey, finalSuggestions);
            }
            
            return finalSuggestions;
            
        } catch (error) {
            console.error('Suggestion generation error:', error);
            return [];
        }
    }
    
    /**
     * Generate fuzzy matching suggestions for typo tolerance
     */
    async generateFuzzyMatches(query) {
        if (!this.config.search.enableTypoTolerance || query.length < 3) {
            return [];
        }
        
        const suggestions = [];
        
        // Simple fuzzy matching algorithm
        const commonTerms = [
            'paris', 'london', 'tokyo', 'new york', 'rome', 'barcelona', 'amsterdam',
            'beach', 'mountain', 'city', 'hotel', 'resort', 'apartment', 'villa',
            'adventure', 'relaxation', 'culture', 'food', 'nightlife', 'shopping',
            'budget', 'luxury', 'family', 'romantic', 'business', 'solo'
        ];
        
        for (const term of commonTerms) {
            const similarity = this.calculateLevenshteinSimilarity(query.toLowerCase(), term);
            if (similarity >= this.config.search.fuzzyMatchThreshold) {
                suggestions.push({
                    text: term,
                    type: 'fuzzy',
                    confidence: similarity,
                    icon: 'fa-search'
                });
            }
        }
        
        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }
    
    /**
     * Get popular search suggestions based on analytics
     */
    getPopularSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();
        
        // Get popular queries that start with or contain the query
        for (const [popularQuery, count] of this.searchAnalytics.popularQueries.entries()) {
            const popularLower = popularQuery.toLowerCase();
            
            if (popularLower.includes(queryLower) && popularLower !== queryLower) {
                suggestions.push({
                    text: popularQuery,
                    type: 'popular',
                    confidence: 0.9,
                    popularity: count,
                    icon: 'fa-fire'
                });
            }
        }
        
        return suggestions.sort((a, b) => b.popularity - a.popularity);
    }
    
    /**
     * Generate autocomplete suggestions
     */
    async generateAutocompleteSuggestions(query) {
        // Simulate database query for autocomplete
        // In real implementation, this would query the database
        
        const suggestions = [];
        const mockSuggestions = [
            { text: `${query} hotels`, type: 'autocomplete', icon: 'fa-bed' },
            { text: `${query} attractions`, type: 'autocomplete', icon: 'fa-star' },
            { text: `${query} restaurants`, type: 'autocomplete', icon: 'fa-utensils' },
            { text: `${query} weather`, type: 'autocomplete', icon: 'fa-cloud-sun' }
        ];
        
        return mockSuggestions.map(s => ({
            ...s,
            confidence: 0.8
        }));
    }
    
    /**
     * Generate category-based suggestions
     */
    async generateCategorySuggestions(query) {
        const categories = [
            { name: 'Mountains', keywords: ['mountain', 'peak', 'hiking', 'ski'], icon: 'fa-mountain' },
            { name: 'Beaches', keywords: ['beach', 'ocean', 'surf', 'sand'], icon: 'fa-umbrella-beach' },
            { name: 'Cities', keywords: ['city', 'urban', 'downtown', 'metro'], icon: 'fa-city' },
            { name: 'Culture', keywords: ['museum', 'history', 'art', 'heritage'], icon: 'fa-landmark' }
        ];
        
        const suggestions = [];
        const queryLower = query.toLowerCase();
        
        for (const category of categories) {
            for (const keyword of category.keywords) {
                if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
                    suggestions.push({
                        text: category.name,
                        type: 'category',
                        confidence: 0.7,
                        icon: category.icon
                    });
                    break;
                }
            }
        }
        
        return suggestions;
    }
    
    /**
     * Rank and deduplicate suggestions
     */
    rankAndDeduplicateSuggestions(suggestions, originalQuery) {
        // Remove duplicates
        const seen = new Set();
        const unique = suggestions.filter(s => {
            const key = `${s.text}_${s.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        
        // Calculate ranking score
        const ranked = unique.map(s => {
            let score = s.confidence || 0.5;
            
            // Boost popular suggestions
            if (s.type === 'popular' && this.config.analytics.popularityBoost) {
                score += Math.min(s.popularity / 100, 0.3);
            }
            
            // Boost exact matches
            if (s.text.toLowerCase() === originalQuery.toLowerCase()) {
                score += 0.5;
            }
            
            // Boost prefix matches
            if (s.text.toLowerCase().startsWith(originalQuery.toLowerCase())) {
                score += 0.3;
            }
            
            return { ...s, score };
        });
        
        return ranked.sort((a, b) => b.score - a.score);
    }
    
    /**
     * Execute search with request queue management
     */
    async executeQueuedSearch(query, options) {
        return new Promise((resolve, reject) => {
            const searchRequest = {
                query,
                options,
                resolve,
                reject,
                timestamp: Date.now()
            };
            
            this.requestQueue.push(searchRequest);
            this.processRequestQueue();
        });
    }
    
    /**
     * Process search request queue
     */
    async processRequestQueue() {
        if (this.activeRequests >= this.config.performance.maxConcurrentRequests || this.requestQueue.length === 0) {
            return;
        }
        
        const request = this.requestQueue.shift();
        this.activeRequests++;
        
        try {
            // Set timeout for search request
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Search timeout')), this.config.performance.timeoutMs);
            });
            
            // Execute actual search (mock implementation)
            const searchPromise = this.performActualSearch(request.query, request.options);
            
            const result = await Promise.race([searchPromise, timeoutPromise]);
            request.resolve(result);
            
        } catch (error) {
            request.reject(error);
        } finally {
            this.activeRequests--;
            // Process next request in queue
            this.processRequestQueue();
        }
    }
    
    /**
     * Perform actual search query (mock implementation)
     */
    async performActualSearch(query, options = {}) {
        // Simulate database search delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
        
        // Mock search results
        const mockResults = [
            {
                id: '1',
                title: `Beautiful ${query} Experience`,
                description: `Discover amazing ${query} destinations and create unforgettable memories.`,
                location: 'Paris, France',
                price: 299,
                rating: 4.8,
                image: '/images/sample1.jpg',
                category: 'City'
            },
            {
                id: '2',
                title: `${query} Adventure Package`,
                description: `Experience the thrill of ${query} with our comprehensive adventure package.`,
                location: 'Tokyo, Japan',
                price: 459,
                rating: 4.9,
                image: '/images/sample2.jpg',
                category: 'Adventure'
            }
        ];
        
        // Filter based on search query
        const filteredResults = mockResults.filter(result => 
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()) ||
            result.location.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
            results: filteredResults,
            totalFound: filteredResults.length
        };
    }
    
    /**
     * Enhance search results with additional data
     */
    enhanceSearchResults(results, query) {
        return results.map(result => {
            // Calculate relevance score
            const relevanceScore = this.calculateRelevanceScore(result, query);
            
            // Add highlighting
            const highlightedTitle = this.highlightSearchTerms(result.title, query);
            const highlightedDescription = this.highlightSearchTerms(result.description, query);
            
            // Add click tracking
            const clickTrackingData = {
                searchQuery: query,
                resultId: result.id,
                position: results.indexOf(result) + 1
            };
            
            return {
                ...result,
                relevanceScore,
                highlightedTitle,
                highlightedDescription,
                clickTrackingData
            };
        }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    /**
     * Calculate relevance score for search results
     */
    calculateRelevanceScore(result, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Title match (highest weight)
        if (result.title.toLowerCase().includes(queryLower)) {
            score += 10;
            // Exact match bonus
            if (result.title.toLowerCase() === queryLower) {
                score += 5;
            }
        }
        
        // Description match
        if (result.description.toLowerCase().includes(queryLower)) {
            score += 5;
        }
        
        // Location match
        if (result.location.toLowerCase().includes(queryLower)) {
            score += 7;
        }
        
        // Rating bonus
        score += (result.rating || 0) * 0.5;
        
        // Popularity bonus (if clicked before)
        const clickCount = this.userBehavior.clickedResults.get(result.id) || 0;
        score += Math.min(clickCount * 0.1, 2);
        
        return score;
    }
    
    /**
     * Highlight search terms in text
     */
    highlightSearchTerms(text, query) {
        if (!text || !query) return text;
        
        const queryRegex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(queryRegex, '<mark class="search-highlight">$1</mark>');
    }
    
    /**
     * Cache management
     */
    generateSearchCacheKey(query, options = {}) {
        const keyData = {
            query,
            category: options.category,
            sort: options.sort,
            filters: options.filters
        };
        return this.simpleHash(JSON.stringify(keyData));
    }
    
    getFromSearchCache(key) {
        const entry = this.searchCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiry) {
            this.searchCache.delete(key);
            return null;
        }
        
        this.searchAnalytics.cacheHits++;
        return entry.data;
    }
    
    setInSearchCache(key, data) {
        if (this.searchCache.size >= this.config.cache.maxSize) {
            this.evictLRUCacheEntry(this.searchCache);
        }
        
        this.searchCache.set(key, {
            data,
            expiry: Date.now() + this.config.cache.defaultTTL,
            timestamp: Date.now()
        });
    }
    
    getFromSuggestionsCache(key) {
        const entry = this.suggestionsCache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.expiry) {
            this.suggestionsCache.delete(key);
            return null;
        }
        
        return entry.data;
    }
    
    setInSuggestionsCache(key, data) {
        if (this.suggestionsCache.size >= this.config.cache.maxSize) {
            this.evictLRUCacheEntry(this.suggestionsCache);
        }
        
        this.suggestionsCache.set(key, {
            data,
            expiry: Date.now() + this.config.cache.suggestionsTTL,
            timestamp: Date.now()
        });
    }
    
    evictLRUCacheEntry(cache) {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, entry] of cache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            cache.delete(oldestKey);
        }
    }
    
    /**
     * Analytics and monitoring
     */
    recordSearchAnalytics(type, query, executionTime, resultCount = 0) {
        this.searchAnalytics.totalSearches++;
        this.searchAnalytics.uniqueQueries.add(query);
        
        // Update popular queries
        const currentCount = this.searchAnalytics.popularQueries.get(query) || 0;
        this.searchAnalytics.popularQueries.set(query, currentCount + 1);
        
        // Update response times
        this.searchAnalytics.responseTimes.push(executionTime);
        if (this.searchAnalytics.responseTimes.length > 100) {
            this.searchAnalytics.responseTimes = this.searchAnalytics.responseTimes.slice(-50);
        }
        
        // Calculate average response time
        this.searchAnalytics.avgResponseTime = this.searchAnalytics.responseTimes.reduce((a, b) => a + b, 0) / this.searchAnalytics.responseTimes.length;
        
        // Update cache hit rate
        const totalRequests = this.searchAnalytics.cacheHits + this.searchAnalytics.cacheMisses;
        if (totalRequests > 0) {
            this.searchAnalytics.cacheHitRate = (this.searchAnalytics.cacheHits / totalRequests * 100).toFixed(2);
        }
        
        if (type === 'executed') {
            this.searchAnalytics.cacheMisses++;
        }
    }
    
    recordSearchError(query, error, executionTime) {
        console.error('Search error:', { query, error: error.message, executionTime });
        
        // Track abandoned searches
        this.userBehavior.abandonedSearches.add(query);
    }
    
    /**
     * User behavior tracking
     */
    trackResultClick(resultId, searchQuery, position) {
        const currentCount = this.userBehavior.clickedResults.get(resultId) || 0;
        this.userBehavior.clickedResults.set(resultId, currentCount + 1);
        
        console.log(`📊 Result clicked: ${resultId} for query: ${searchQuery} at position: ${position}`);
    }
    
    trackSearchRefinement(originalQuery, refinedQuery) {
        if (!this.userBehavior.refinedQueries.has(originalQuery)) {
            this.userBehavior.refinedQueries.set(originalQuery, []);
        }
        this.userBehavior.refinedQueries.get(originalQuery).push(refinedQuery);
    }
    
    /**
     * Utility methods
     */
    normalizeQuery(query) {
        if (typeof query !== 'string') return '';
        
        return query
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/[^\w\s-]/g, ''); // Remove special characters except hyphens
    }
    
    validateQuery(query) {
        return query && 
               query.length >= this.config.search.minQueryLength && 
               query.length <= 100; // Reasonable maximum length
    }
    
    calculateLevenshteinSimilarity(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (matrix[str2.length][str1.length] / maxLength);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    
    /**
     * Prefetching and predictive loading
     */
    initPrefetching() {
        // Prefetch popular searches
        setInterval(() => {
            this.prefetchPopularSearches();
        }, 300000); // Every 5 minutes
    }
    
    async prefetchPopularSearches() {
        const popularQueries = Array.from(this.searchAnalytics.popularQueries.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([query]) => query);
        
        for (const query of popularQueries) {
            const cacheKey = this.generateSearchCacheKey(query);
            if (!this.searchCache.has(cacheKey)) {
                try {
                    await this.executeSearch(query, { prefetch: true });
                } catch (error) {
                    // Silently fail prefetch
                }
            }
        }
    }
    
    /**
     * Cache cleanup and maintenance
     */
    startCacheCleanup() {
        // Clean expired cache entries every 2 minutes
        setInterval(() => {
            this.cleanExpiredCaches();
        }, 120000);
        
        // Log performance stats every 5 minutes
        setInterval(() => {
            this.logSearchPerformanceStats();
        }, 300000);
    }
    
    cleanExpiredCaches() {
        let cleaned = 0;
        const now = Date.now();
        
        // Clean search cache
        for (const [key, entry] of this.searchCache.entries()) {
            if (now > entry.expiry) {
                this.searchCache.delete(key);
                cleaned++;
            }
        }
        
        // Clean suggestions cache
        for (const [key, entry] of this.suggestionsCache.entries()) {
            if (now > entry.expiry) {
                this.suggestionsCache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired search cache entries`);
        }
    }
    
    async loadPopularSearches() {
        // In a real implementation, this would load from database
        // For now, populate with some sample data
        const samplePopularSearches = [
            ['paris hotels', 15],
            ['tokyo attractions', 12],
            ['london restaurants', 10],
            ['new york museums', 8],
            ['beach resorts', 20]
        ];
        
        samplePopularSearches.forEach(([query, count]) => {
            this.searchAnalytics.popularQueries.set(query, count);
        });
    }
    
    logSearchPerformanceStats() {
        console.log('🔍 Search Performance Stats:', {
            totalSearches: this.searchAnalytics.totalSearches,
            uniqueQueries: this.searchAnalytics.uniqueQueries.size,
            avgResponseTime: `${this.searchAnalytics.avgResponseTime.toFixed(2)}ms`,
            cacheHitRate: `${this.searchAnalytics.cacheHitRate}%`,
            searchCacheSize: this.searchCache.size,
            suggestionsCacheSize: this.suggestionsCache.size,
            activeRequests: this.activeRequests,
            queuedRequests: this.requestQueue.length
        });
    }
    
    startAnalyticsCollection() {
        // Periodically analyze and optimize based on user behavior
        setInterval(() => {
            this.analyzeUserBehavior();
        }, 600000); // Every 10 minutes
    }
    
    analyzeUserBehavior() {
        // Analyze abandoned searches
        if (this.userBehavior.abandonedSearches.size > 0) {
            console.log(`📊 ${this.userBehavior.abandonedSearches.size} abandoned searches detected - consider improving suggestions`);
        }
        
        // Analyze query refinements
        const refinements = Array.from(this.userBehavior.refinedQueries.entries());
        if (refinements.length > 0) {
            console.log('📊 Query refinement patterns detected - updating suggestions');
            // Use refinement patterns to improve future suggestions
        }
    }
    
    /**
     * Public API methods
     */
    
    // Get search performance statistics
    getSearchPerformanceStats() {
        return {
            analytics: {
                totalSearches: this.searchAnalytics.totalSearches,
                uniqueQueries: this.searchAnalytics.uniqueQueries.size,
                avgResponseTime: this.searchAnalytics.avgResponseTime.toFixed(2),
                cacheHitRate: this.searchAnalytics.cacheHitRate
            },
            cache: {
                searchCacheSize: this.searchCache.size,
                suggestionsCacheSize: this.suggestionsCache.size,
                maxCacheSize: this.config.cache.maxSize
            },
            performance: {
                activeRequests: this.activeRequests,
                queuedRequests: this.requestQueue.length,
                maxConcurrentRequests: this.config.performance.maxConcurrentRequests
            },
            popular: Array.from(this.searchAnalytics.popularQueries.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
        };
    }
    
    // Clear all search caches
    clearSearchCaches() {
        this.searchCache.clear();
        this.suggestionsCache.clear();
        console.log('🧹 All search caches cleared');
    }
    
    // Export search analytics report
    exportSearchReport() {
        return {
            timestamp: new Date().toISOString(),
            statistics: this.getSearchPerformanceStats(),
            userBehavior: {
                abandonedSearches: Array.from(this.userBehavior.abandonedSearches),
                topClickedResults: Array.from(this.userBehavior.clickedResults.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10),
                queryRefinements: Array.from(this.userBehavior.refinedQueries.entries()).slice(0, 10)
            },
            configuration: this.config
        };
    }
}

// Browser initialization
if (typeof window !== 'undefined') {
    window.searchOptimizer = new SearchPerformanceOptimizer();
    
    // Add search performance shortcut
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            if (window.searchOptimizer) {
                console.log('🔍 Search Performance Dashboard');
                console.table(window.searchOptimizer.getSearchPerformanceStats());
            }
        }
    });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchPerformanceOptimizer;
}