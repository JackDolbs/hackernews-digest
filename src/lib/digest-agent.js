/**
 * HackerNews AI Digest Agent
 * Main orchestrator for fetching, filtering, and summarizing HN stories
 */

import dotenv from 'dotenv';
import { getTrendingStories } from './services/hackernews.js';
import { filterTechStories, categorizeTechStories } from './services/filter.js';
import { initializeOpenAI, summarizeStories, generateDigestOverview } from './services/ai.js';
import digestCache from './services/cache.js';

// Load environment variables
dotenv.config();

/**
 * Configuration for the digest agent
 */
const DEFAULT_CONFIG = {
	storyLimit: 15,
	hoursBack: 24,
	openaiApiKey: process.env.OPENAI_API_KEY
};

/**
 * Generate a complete tech digest
 * @param {Object} config - Configuration options
 * @returns {Promise<Object>} Complete digest object
 */
export async function generateDigest(config = {}) {
	const finalConfig = { ...DEFAULT_CONFIG, ...config };
	
	// Check cache first
	const cachedDigest = digestCache.get(finalConfig);
	if (cachedDigest) {
		return cachedDigest;
	}
	
	console.log('🚀 Starting HackerNews AI Digest generation...');
	
	try {
		// Initialize OpenAI
		if (!finalConfig.openaiApiKey) {
			throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable.');
		}
		initializeOpenAI(finalConfig.openaiApiKey);
		
		// Step 1: Fetch trending stories from HackerNews
		console.log(`📰 Fetching trending stories (last ${finalConfig.hoursBack} hours)...`);
		const trendingStories = await getTrendingStories(50, finalConfig.hoursBack);
		console.log(`   Found ${trendingStories.length} trending stories`);
		
		// Step 2: Filter for tech-related content
		console.log('🔍 Filtering for tech-related stories...');
		const techStories = filterTechStories(trendingStories);
		console.log(`   Filtered to ${techStories.length} tech stories`);
		
		// Step 3: Take top stories by score and limit
		const topTechStories = techStories
			.sort((a, b) => b.score - a.score)
			.slice(0, finalConfig.storyLimit);
		console.log(`   Selected top ${topTechStories.length} stories for summarization`);
		
		// Step 4: Generate AI summaries
		console.log('🤖 Generating AI summaries...');
		const summaries = await summarizeStories(topTechStories);
		console.log(`   Generated ${summaries.length} summaries`);
		
		// Step 5: Categorize stories
		const categorizedStories = categorizeTechStories(topTechStories);
		
		// Step 6: Generate digest overview
		console.log('📝 Generating digest overview...');
		const overview = await generateDigestOverview(summaries, new Date().toDateString());
		
		// Step 7: Compile final digest
		const digest = {
			id: `digest-${Date.now()}`,
			generated_at: new Date().toISOString(),
			date: new Date().toDateString(),
			overview: overview,
			summaries: summaries,
			categories: categorizedStories,
			stats: {
				total_stories_fetched: trendingStories.length,
				tech_stories_found: techStories.length,
				stories_summarized: summaries.length,
				categories_found: Object.keys(categorizedStories).length
			},
			config: finalConfig
		};
		
		console.log('✅ Digest generation complete!');
		console.log(`   📊 Stats: ${digest.stats.stories_summarized} stories across ${digest.stats.categories_found} categories`);
		
		// Cache the digest for future requests
		digestCache.set(finalConfig, digest);
		
		return digest;
		
	} catch (error) {
		console.error('❌ Error generating digest:', error);
		throw error;
	}
}

/**
 * Save digest to a JSON file (for demo purposes)
 * @param {Object} digest - Digest object to save
 * @param {string} filename - Optional filename
 */
export async function saveDigestToFile(digest, filename) {
	const fs = await import('fs/promises');
	const path = await import('path');
	
	const digestsDir = 'digests';
	const finalFilename = filename || `digest-${new Date().toISOString().split('T')[0]}.json`;
	const filePath = path.join(digestsDir, finalFilename);
	
	try {
		// Ensure digests directory exists
		await fs.mkdir(digestsDir, { recursive: true });
		
		// Save digest
		await fs.writeFile(filePath, JSON.stringify(digest, null, 2));
		console.log(`💾 Digest saved to: ${filePath}`);
		
		return filePath;
	} catch (error) {
		console.error('Error saving digest:', error);
		throw error;
	}
}

/**
 * CLI function to generate and save digest
 */
export async function runDigestCLI() {
	try {
		const digest = await generateDigest();
		const filePath = await saveDigestToFile(digest);
		
		console.log('\n📋 Digest Summary:');
		console.log(`   Date: ${digest.date}`);
		console.log(`   Stories: ${digest.stats.stories_summarized}`);
		console.log(`   Categories: ${Object.keys(digest.categories).join(', ')}`);
		console.log(`   File: ${filePath}`);
		console.log('\n🎉 Digest generation completed successfully!');
		
		return digest;
	} catch (error) {
		console.error('\n💥 Failed to generate digest:', error.message);
		process.exit(1);
	}
}

// If running directly from command line
if (import.meta.url === `file://${process.argv[1]}`) {
	runDigestCLI();
}
