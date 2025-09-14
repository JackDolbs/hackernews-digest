import PocketBase from 'pocketbase';

class PocketBaseCache {
    constructor() {
        const pbUrl = import.meta.env.VITE_POCKETBASE_URL;
        if (!pbUrl) {
            throw new Error('Missing VITE_POCKETBASE_URL environment variable');
        }
        
        console.log('🔍 PocketBase URL:', pbUrl);
        console.log('🔍 Collection name:', 'digests_cache');
        
        this.pb = new PocketBase(pbUrl);
        this.defaultTTL = 45 * 60 * 1000; // 45 minutes in milliseconds
        this.collection = 'digests_cache';
    }

    generateKey(params) {
        const storyLimit = params?.storyLimit || 12;
        const hoursBack = params?.hoursBack || 24;
        const timeWindow = Math.floor(Date.now() / (this.defaultTTL));
        return `digest_${storyLimit}_${hoursBack}_${timeWindow}`;
    }

    async get(params) {
        try {
            const key = this.generateKey(params);
            
            console.log('Looking for cached digest...', { key, collection: this.collection });
            
            // First, let's see what records exist
            const allRecords = await this.pb.collection(this.collection).getFullList();
            console.log('🔍 Current records in collection:', allRecords.length);
            allRecords.forEach((rec, index) => {
                console.log(`  Record ${index + 1}:`, { id: rec.id, key: rec.key, created: rec.created });
            });
            
            try {
                // Try to find a cache entry with this key that hasn't expired
                const result = await this.pb.collection(this.collection).getFirstListItem(
                    `key = "${key}" && created >= "${new Date(Date.now() - this.defaultTTL).toISOString()}"`,
                    { sort: '-created' }
                );

                if (!result) {
                    console.log('No valid cache entry found');
                    return null;
                }

                const now = Date.now();
                const timestamp = new Date(result.created).getTime();
                const ageMinutes = Math.round((now - timestamp) / 60000);

                console.log(`📦 Cache hit! Found digest:`, result);
                console.log(`Cache age: ${ageMinutes} minutes`);

                return {
                    ...JSON.parse(result.digest),
                    cache_info: {
                        cached: true,
                        generated_at: result.created,
                        served_from_cache_at: new Date().toISOString(),
                        cache_age_minutes: ageMinutes
                    }
                };
            } catch (error) {
                if (error.status === 404) {
                    console.log('No cache entry found');
                    return null;
                }
                console.error('Failed to fetch cache entry:', error.response || error);
                throw error;
            }

        } catch (error) {
            // If record is not found, PocketBase throws an error
            if (error.status === 404) {
                return null;
            }
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set(params, digest) {
        try {
            const key = this.generateKey(params);
            // Filter out sensitive data
            const safeDigest = { ...digest };
            if (safeDigest.config) {
                delete safeDigest.config.openaiApiKey;
            }
            const safeParams = { ...params };
            delete safeParams.openaiApiKey;

            const data = {
                key,
                digest: JSON.stringify(safeDigest),
                params: JSON.stringify(safeParams)
            };

            console.log('Creating new cache entry...', { key, collection: this.collection });

            try {
                console.log('🌐 Making request to:', `${this.pb.baseUrl}/api/collections/${this.collection}/records`);
                console.log('📤 Sending data:', { key, digest: 'DIGEST_DATA_HIDDEN', params: safeParams });
                
                // Create new cache entry
                const record = await this.pb.collection(this.collection).create(data);
                console.log('✅ Cache entry created:', record);
                console.log('🔗 Direct PocketBase link:', `${this.pb.baseUrl}/_/#/collections?collection=${this.pb.collection(this.collection).collectionIdOrName}`);
                
                // Verify the record exists
                const verifyRecord = await this.pb.collection(this.collection).getOne(record.id);
                console.log('✅ Verified cache entry exists:', verifyRecord.id);
                
                // List ALL records in the collection to see what's actually there
                const allRecords = await this.pb.collection(this.collection).getFullList();
                console.log('📋 ALL records in collection:', allRecords.length, 'records found');
                allRecords.forEach((rec, index) => {
                    console.log(`  Record ${index + 1}:`, { id: rec.id, key: rec.key, created: rec.created });
                });
            } catch (error) {
                console.error('Failed to create cache entry:', {
                    error: error.response || error,
                    url: error.url,
                    status: error.status,
                    data: error.data,
                    collection: this.collection,
                    key: key
                });
                throw error;
            }
            
            try {
                // Clean up old entries for this key (but NOT the one we just created)
                const cutoffTime = new Date(Date.now() - this.defaultTTL).toISOString();
                console.log(`Looking for old entries created before: ${cutoffTime}`);
                
                const oldEntries = await this.pb.collection(this.collection).getFullList({
                    filter: `key = "${key}" && created < "${cutoffTime}"`,
                    sort: '-created'
                });

                console.log(`Found ${oldEntries.length} old entries to clean up (excluding current record ${record.id})`);

                // Delete old entries in parallel
                if (oldEntries.length > 0) {
                    await Promise.all(
                        oldEntries.map(entry => 
                            this.pb.collection(this.collection).delete(entry.id)
                        )
                    );
                    console.log(`🧹 Cleaned up ${oldEntries.length} old entries`);
                }
            } catch (error) {
                console.error('Failed to clean up old entries:', error.response || error);
                // Don't throw here, cleaning up old entries is not critical
            }

            console.log(`💾 Cached digest with key: ${key} (TTL: ${this.defaultTTL / 60000} minutes)`);

        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async clear() {
        try {
            // Ensure we're authenticated
            if (!this.pb.authStore.isValid) {
                await this.authenticate();
            }
            const entries = await this.pb.collection(this.collection).getFullList();
            
            // Delete all entries in parallel
            await Promise.all(
                entries.map(entry => 
                    this.pb.collection(this.collection).delete(entry.id)
                )
            );

            console.log(`🗑️ Cleared ${entries.length} cache entries`);

        } catch (error) {
            console.error('Cache clear error:', error);
            throw error;
        }
    }

    async getStats() {
        try {
            // Ensure we're authenticated
            if (!this.pb.authStore.isValid) {
                await this.authenticate();
            }
            const now = Date.now();
            const entries = await this.pb.collection(this.collection).getFullList();
            
            const stats = entries.reduce((acc, entry) => {
                const timestamp = new Date(entry.created).getTime();
                const age = now - timestamp;
                
                if (age < this.defaultTTL) {
                    acc.fresh_entries++;
                } else {
                    acc.expired_entries++;
                }
                
                acc.oldest_entry_age_minutes = Math.max(
                    acc.oldest_entry_age_minutes,
                    Math.floor(age / 60000)
                );
                
                return acc;
            }, {
                total_entries: entries.length,
                fresh_entries: 0,
                expired_entries: 0,
                oldest_entry_age_minutes: 0
            });

            // Estimate cache size
            const totalSize = entries.reduce((size, entry) => 
                size + (entry.digest?.length || 0), 0
            );

            return {
                ...stats,
                cache_size_mb: (totalSize / (1024 * 1024)).toFixed(2)
            };

        } catch (error) {
            console.error('Cache stats error:', error);
            throw error;
        }
    }
}

// Create singleton instance
const pbCache = new PocketBaseCache();

export default pbCache;
