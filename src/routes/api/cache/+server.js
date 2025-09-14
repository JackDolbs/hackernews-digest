/**
 * Cache management API endpoints
 */

import { json } from '@sveltejs/kit';
import digestCache from '$lib/services/cache.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const stats = digestCache.getStats();
		
		return json({
			status: 'success',
			cache_stats: stats,
			timestamp: new Date().toISOString()
		});
		
	} catch (error) {
		console.error('Cache stats error:', error);
		return json({ 
			error: 'Failed to get cache statistics' 
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE() {
	try {
		digestCache.clear();
		
		return json({
			status: 'success',
			message: 'Cache cleared successfully',
			timestamp: new Date().toISOString()
		});
		
	} catch (error) {
		console.error('Cache clear error:', error);
		return json({ 
			error: 'Failed to clear cache' 
		}, { status: 500 });
	}
}
