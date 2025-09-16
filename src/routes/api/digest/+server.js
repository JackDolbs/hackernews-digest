/**
 * API endpoint for generating digests
 */

import { json } from '@sveltejs/kit';
import { generateDigest } from '$lib/digest-agent.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
    if (!locals?.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
	try {
		// Get query parameters
		const storyLimit = parseInt(url.searchParams.get('limit') || '12');
		const hoursBack = parseInt(url.searchParams.get('hours') || '24');
		
		// Validate parameters
		if (storyLimit < 1 || storyLimit > 50) {
			return json({ error: 'Story limit must be between 1 and 50' }, { status: 400 });
		}
		
		if (hoursBack < 1 || hoursBack > 168) {
			return json({ error: 'Hours back must be between 1 and 168 (1 week)' }, { status: 400 });
		}
		
		// Generate digest
		const digest = await generateDigest({
			storyLimit,
			hoursBack,
			openaiApiKey: process.env.OPENAI_API_KEY
		});
		
		return json(digest);
		
	} catch (error) {
		console.error('API Error:', error);
		
		// Return appropriate error response
		if (error.message.includes('OpenAI API key')) {
			return json({ 
				error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
			}, { status: 500 });
		}
		
		return json({ 
			error: 'Failed to generate digest. Please try again later.' 
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals?.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
	try {
		const { storyLimit = 12, hoursBack = 24 } = await request.json();
		
		// Validate parameters
		if (storyLimit < 1 || storyLimit > 50) {
			return json({ error: 'Story limit must be between 1 and 50' }, { status: 400 });
		}
		
		if (hoursBack < 1 || hoursBack > 168) {
			return json({ error: 'Hours back must be between 1 and 168 (1 week)' }, { status: 400 });
		}
		
		// Generate digest
		const digest = await generateDigest({
			storyLimit,
			hoursBack,
			openaiApiKey: process.env.OPENAI_API_KEY
		});
		
		return json(digest);
		
	} catch (error) {
		console.error('API Error:', error);
		
		// Return appropriate error response
		if (error.message.includes('OpenAI API key')) {
			return json({ 
				error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
			}, { status: 500 });
		}
		
		return json({ 
			error: 'Failed to generate digest. Please try again later.' 
		}, { status: 500 });
	}
}
