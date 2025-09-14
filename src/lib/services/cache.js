/**
 * Simple in-memory cache for digests
 * Caches digests for 30-60 minutes to avoid regenerating identical content
 */

class DigestCache {
	constructor() {
		this.cache = new Map();
		this.defaultTTL = 45 * 60 * 1000; // 45 minutes in milliseconds
	}

	/**
	 * Generate a cache key based on digest parameters
	 * @param {Object} params - Digest generation parameters
	 * @returns {string} Cache key
	 */
	generateKey(params) {
		const { storyLimit = 12, hoursBack = 24 } = params;
		
		// Create time window key (rounds to nearest 30 minutes)
		// This ensures we get cache hits for similar time periods
		const now = new Date();
		const timeWindow = Math.floor(now.getTime() / (30 * 60 * 1000));
		
		return `digest_${storyLimit}_${hoursBack}_${timeWindow}`;
	}

	/**
	 * Get cached digest if available and fresh
	 * @param {Object} params - Digest generation parameters
	 * @returns {Object|null} Cached digest or null if not found/expired
	 */
	get(params) {
		const key = this.generateKey(params);
		const cached = this.cache.get(key);
		
		if (!cached) {
			return null;
		}

		// Check if cache entry is still valid
		const now = Date.now();
		if (now - cached.timestamp > cached.ttl) {
			// Cache expired, remove it
			this.cache.delete(key);
			return null;
		}

		console.log(`📦 Cache hit! Serving cached digest (${Math.round((now - cached.timestamp) / 60000)} minutes old)`);
		
		// Update the served_at timestamp but keep original generated_at
		return {
			...cached.digest,
			served_at: new Date().toISOString(),
			cache_info: {
				cached: true,
				generated_at: cached.digest.generated_at,
				served_from_cache_at: new Date().toISOString(),
				cache_age_minutes: Math.round((now - cached.timestamp) / 60000)
			}
		};
	}

	/**
	 * Store digest in cache
	 * @param {Object} params - Digest generation parameters
	 * @param {Object} digest - Generated digest to cache
	 * @param {number} ttl - Time to live in milliseconds (optional)
	 */
	set(params, digest, ttl = null) {
		const key = this.generateKey(params);
		const cacheEntry = {
			digest: {
				...digest,
				cache_info: {
					cached: false,
					generated_at: digest.generated_at
				}
			},
			timestamp: Date.now(),
			ttl: ttl || this.defaultTTL,
			params
		};

		this.cache.set(key, cacheEntry);
		
		console.log(`💾 Cached digest with key: ${key} (TTL: ${Math.round((ttl || this.defaultTTL) / 60000)} minutes)`);
		
		// Clean up old cache entries periodically
		this.cleanup();
	}

	/**
	 * Remove expired cache entries
	 */
	cleanup() {
		const now = Date.now();
		let removedCount = 0;

		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > entry.ttl) {
				this.cache.delete(key);
				removedCount++;
			}
		}

		if (removedCount > 0) {
			console.log(`🧹 Cleaned up ${removedCount} expired cache entries`);
		}
	}

	/**
	 * Clear all cache entries
	 */
	clear() {
		const size = this.cache.size;
		this.cache.clear();
		console.log(`🗑️  Cleared ${size} cache entries`);
	}

	/**
	 * Get cache statistics
	 * @returns {Object} Cache stats
	 */
	getStats() {
		const now = Date.now();
		const entries = Array.from(this.cache.values());
		
		return {
			total_entries: entries.length,
			fresh_entries: entries.filter(entry => 
				now - entry.timestamp <= entry.ttl
			).length,
			expired_entries: entries.filter(entry => 
				now - entry.timestamp > entry.ttl
			).length,
			oldest_entry_age_minutes: entries.length > 0 
				? Math.round((now - Math.min(...entries.map(e => e.timestamp))) / 60000)
				: 0,
			cache_size_mb: this.estimateSize()
		};
	}

	/**
	 * Estimate cache size in MB (rough calculation)
	 * @returns {number} Estimated size in MB
	 */
	estimateSize() {
		const jsonString = JSON.stringify(Array.from(this.cache.entries()));
		return Math.round((jsonString.length * 2) / (1024 * 1024) * 100) / 100; // Rough estimate
	}
}

// Create singleton instance
const digestCache = new DigestCache();

export default digestCache;
