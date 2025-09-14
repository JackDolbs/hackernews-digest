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
        // Create a stable key that doesn't change every request
        // Use a time window that changes every 45 minutes (TTL)
        const now = Date.now();
        const timeWindow = Math.floor(now / this.defaultTTL);
        const key = `digest_${storyLimit}_${hoursBack}_${timeWindow}`;
        
        console.log('🔑 Key generation:', {
            now: new Date(now).toISOString(),
            ttl_minutes: this.defaultTTL / 60000,
            timeWindow,
            key,
            params: { storyLimit, hoursBack }
        });
        
        return key;
    }

    async get(params) {
        try {
            const key = this.generateKey(params);
            
            console.log('Looking for cached digest...', { key, collection: this.collection });
            
            // First, let's see what records exist
            console.log('🔍 Testing PocketBase connection...');
            console.log('Collection:', this.collection);
            console.log('PocketBase URL:', this.pb.baseUrl);
            
            const allRecords = await this.pb.collection(this.collection).getFullList();
            console.log('🔍 Current records in collection:', allRecords.length);
            
            if (allRecords.length === 0) {
                console.log('❌ No records found - this might be why cache lookup fails');
                // Try a direct API call to debug
                try {
                    const directCall = await fetch(`${this.pb.baseUrl}/api/collections/${this.collection}/records`);
                    const directResult = await directCall.json();
                    console.log('🌐 Direct API call result:', directResult);
                } catch (directError) {
                    console.error('Direct API call failed:', directError);
                }
            }
            
            allRecords.forEach((rec, index) => {
                const age = Date.now() - new Date(rec.created).getTime();
                const ageMinutes = Math.round(age / 60000);
                console.log(`  Record ${index + 1}:`, { 
                    id: rec.id, 
                    key: rec.key, 
                    created: rec.created,
                    ageMinutes: ageMinutes,
                    expired: age > this.defaultTTL
                });
            });
            
            try {
                // First, try to find any record with this key
                console.log('🔍 Searching for record with key:', key);
                const keyOnlyResult = await this.pb.collection(this.collection).getFirstListItem(
                    `key = "${key}"`,
                    { sort: '-created' }
                );
                console.log('✅ Found record:', keyOnlyResult?.id || 'none');
                
                if (keyOnlyResult) {
                    const age = Date.now() - new Date(keyOnlyResult.created).getTime();
                    const isExpired = age > this.defaultTTL;
                    
                    console.log('🔍 Found record with key:', {
                        id: keyOnlyResult.id,
                        created: keyOnlyResult.created,
                        ageMinutes: Math.round(age / 60000),
                        isExpired,
                        ttlMinutes: this.defaultTTL / 60000
                    });
                    
                        if (!isExpired) {
                            console.log(`📦 Cache hit! Found digest:`, keyOnlyResult);
                            
                            // The digest field might already be an object if PocketBase auto-parses it
                            let digestData;
                            if (typeof keyOnlyResult.digest === 'string') {
                                digestData = JSON.parse(keyOnlyResult.digest);
                            } else {
                                digestData = keyOnlyResult.digest;
                            }
                            
                            return {
                                ...digestData,
                                cache_info: {
                                    cached: true,
                                    generated_at: keyOnlyResult.created,
                                    served_from_cache_at: new Date().toISOString(),
                                    cache_age_minutes: Math.round(age / 60000)
                                }
                            };
                        } else {
                        console.log('Record found but expired, will generate new digest');
                    }
                } else {
                    console.log('No record found with this key');
                }
                
                return null;
            } catch (error) {
                if (error.status === 404) {
                    console.log('No cache entry found (404 error)');
                    return null;
                }
                console.error('Failed to fetch cache entry:', error.response || error);
                console.error('Error details:', {
                    status: error.status,
                    message: error.message,
                    url: error.url
                });
                return null;
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

            let record;
            try {
                console.log('🌐 Making request to:', `${this.pb.baseUrl}/api/collections/${this.collection}/records`);
                console.log('📤 Sending data:', { key, digest: 'DIGEST_DATA_HIDDEN', params: safeParams });
                
                // Create new cache entry
                record = await this.pb.collection(this.collection).create(data);
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
                console.log(`Current record ID: ${record.id} (will be excluded from cleanup)`);
                
                const oldEntries = await this.pb.collection(this.collection).getFullList({
                    filter: `key = "${key}" && created < "${cutoffTime}" && id != "${record.id}"`,
                    sort: '-created'
                });

                console.log(`Found ${oldEntries.length} old entries to clean up (excluding current record)`);

                // Delete old entries in parallel
                if (oldEntries.length > 0) {
                    await Promise.all(
                        oldEntries.map(entry => 
                            this.pb.collection(this.collection).delete(entry.id)
                        )
                    );
                    console.log(`🧹 Cleaned up ${oldEntries.length} old entries`);
                } else {
                    console.log('No old entries to clean up');
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
