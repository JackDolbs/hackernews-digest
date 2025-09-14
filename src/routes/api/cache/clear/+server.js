import { json } from '@sveltejs/kit';
import pbCache from '$lib/services/pb-cache.js';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	try {
		await pbCache.clear();
		return json({ message: 'Cache cleared successfully' });
	} catch (error) {
		console.error('Error clearing cache:', error);
		return json({ error: 'Failed to clear cache' }, { status: 500 });
	}
}