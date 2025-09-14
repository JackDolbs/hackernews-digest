import { json } from '@sveltejs/kit';
import digestCache from '$lib/services/cache.js';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	try {
		digestCache.clear();
		return json({ message: 'Cache cleared successfully' });
	} catch (error) {
		console.error('Error clearing cache:', error);
		return json({ error: 'Failed to clear cache' }, { status: 500 });
	}
}
