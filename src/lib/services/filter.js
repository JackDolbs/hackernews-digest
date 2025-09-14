/**
 * Tech Story Filtering Service
 * Filters HackerNews stories for tech-relevant content
 */

// Keywords that indicate tech-related content
const TECH_KEYWORDS = [
	// Programming & Development
	'javascript', 'python', 'react', 'vue', 'angular', 'node', 'typescript', 'rust', 'go', 'java',
	'c++', 'swift', 'kotlin', 'flutter', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
	
	// AI & ML
	'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network',
	'chatgpt', 'openai', 'llm', 'gpt', 'claude', 'gemini', 'anthropic',
	
	// Tech Companies & Products
	'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook', 'twitter', 'x.com', 'tesla',
	'nvidia', 'intel', 'amd', 'github', 'gitlab', 'vercel', 'netlify',
	
	// Web & Mobile
	'web development', 'mobile app', 'ios', 'android', 'api', 'rest', 'graphql', 'database',
	'postgresql', 'mysql', 'mongodb', 'redis', 'firebase',
	
	// Infrastructure & DevOps
	'cloud', 'serverless', 'microservices', 'devops', 'ci/cd', 'deployment', 'hosting',
	
	// Emerging Tech
	'blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3', 'nft', 'metaverse', 'vr', 'ar',
	'quantum computing', 'iot', '5g', 'edge computing',
	
	// Business Tech
	'startup', 'saas', 'fintech', 'edtech', 'healthtech', 'proptech', 'venture capital', 'vc',
	'ipo', 'acquisition', 'funding', 'series a', 'series b',
	
	// General Tech Terms
	'software', 'hardware', 'tech', 'technology', 'digital', 'cyber', 'data', 'analytics',
	'algorithm', 'open source', 'framework', 'library', 'tool', 'platform'
];

// Domain patterns that typically indicate tech content
const TECH_DOMAINS = [
	'github.com', 'stackoverflow.com', 'medium.com', 'dev.to', 'techcrunch.com',
	'arstechnica.com', 'theverge.com', 'wired.com', 'engadget.com', 'venturebeat.com',
	'blog.', 'docs.', 'developer.', 'api.', 'engineering.'
];

/**
 * Check if a story is tech-related based on title and URL
 * @param {Object} story - Story object with title and url
 * @returns {boolean} True if story appears to be tech-related
 */
export function isTechStory(story) {
	if (!story.title || !story.url) return false;
	
	const title = story.title.toLowerCase();
	const url = story.url.toLowerCase();
	
	// Check for tech keywords in title
	const hasKeyword = TECH_KEYWORDS.some(keyword => 
		title.includes(keyword.toLowerCase())
	);
	
	// Check for tech domains in URL
	const hasTechDomain = TECH_DOMAINS.some(domain => 
		url.includes(domain)
	);
	
	return hasKeyword || hasTechDomain;
}

/**
 * Filter an array of stories for tech-related content
 * @param {Object[]} stories - Array of story objects
 * @returns {Object[]} Filtered array of tech stories
 */
export function filterTechStories(stories) {
	return stories.filter(isTechStory);
}

/**
 * Categorize tech stories into different types
 * @param {Object[]} stories - Array of tech story objects
 * @returns {Object} Object with categorized stories
 */
export function categorizeTechStories(stories) {
	const categories = {
		'AI & ML': [],
		'Web Development': [],
		'Mobile': [],
		'Cloud & Infrastructure': [],
		'Startups & Business': [],
		'Security': [],
		'Hardware': [],
		'General Tech': []
	};
	
	stories.forEach(story => {
		const title = story.title.toLowerCase();
		let categorized = false;
		
		// AI & ML
		if (title.match(/\b(ai|artificial intelligence|machine learning|ml|deep learning|neural|gpt|llm|openai|anthropic|claude)\b/)) {
			categories['AI & ML'].push(story);
			categorized = true;
		}
		
		// Web Development
		else if (title.match(/\b(javascript|react|vue|angular|web|frontend|backend|api|database)\b/)) {
			categories['Web Development'].push(story);
			categorized = true;
		}
		
		// Mobile
		else if (title.match(/\b(ios|android|mobile|app|flutter|swift|kotlin)\b/)) {
			categories['Mobile'].push(story);
			categorized = true;
		}
		
		// Cloud & Infrastructure
		else if (title.match(/\b(cloud|aws|azure|gcp|docker|kubernetes|serverless|devops)\b/)) {
			categories['Cloud & Infrastructure'].push(story);
			categorized = true;
		}
		
		// Startups & Business
		else if (title.match(/\b(startup|funding|ipo|acquisition|saas|fintech|venture)\b/)) {
			categories['Startups & Business'].push(story);
			categorized = true;
		}
		
		// Security
		else if (title.match(/\b(security|cyber|breach|hack|vulnerability|privacy)\b/)) {
			categories['Security'].push(story);
			categorized = true;
		}
		
		// Hardware
		else if (title.match(/\b(hardware|chip|processor|nvidia|intel|amd|quantum)\b/)) {
			categories['Hardware'].push(story);
			categorized = true;
		}
		
		// General Tech (fallback)
		if (!categorized) {
			categories['General Tech'].push(story);
		}
	});
	
	// Remove empty categories
	Object.keys(categories).forEach(key => {
		if (categories[key].length === 0) {
			delete categories[key];
		}
	});
	
	return categories;
}
