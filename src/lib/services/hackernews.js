/**
 * HackerNews API Service
 * Fetches top stories and story details from HackerNews API
 */

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

/**
 * Fetch top story IDs from HackerNews
 * @param {number} limit - Number of stories to fetch
 * @returns {Promise<number[]>} Array of story IDs
 */
export async function getTopStoryIds(limit = 30) {
	try {
		const response = await fetch(`${HN_API_BASE}/topstories.json`);
		const storyIds = await response.json();
		return storyIds.slice(0, limit);
	} catch (error) {
		console.error('Error fetching top story IDs:', error);
		throw error;
	}
}

/**
 * Fetch story details by ID
 * @param {number} id - Story ID
 * @returns {Promise<Object|null>} Story object or null if failed
 */
export async function getStory(id) {
	try {
		const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
		const story = await response.json();
		
		// Only return stories (not jobs, polls, etc.) with URLs
		if (story && story.type === 'story' && story.url) {
			return {
				id: story.id,
				title: story.title,
				url: story.url,
				score: story.score || 0,
				descendants: story.descendants || 0, // comment count
				time: story.time,
				by: story.by,
				text: story.text || ''
			};
		}
		return null;
	} catch (error) {
		console.error(`Error fetching story ${id}:`, error);
		return null;
	}
}

/**
 * Fetch multiple stories concurrently
 * @param {number[]} ids - Array of story IDs
 * @returns {Promise<Object[]>} Array of story objects
 */
export async function getStories(ids) {
	const storyPromises = ids.map(id => getStory(id));
	const stories = await Promise.all(storyPromises);
	
	// Filter out null results and return valid stories
	return stories.filter(story => story !== null);
}

/**
 * Get trending tech stories (top stories from recent timeframe)
 * @param {number} limit - Number of stories to return
 * @param {number} hoursBack - Hours to look back for "recent" stories
 * @returns {Promise<Object[]>} Array of trending tech stories
 */
export async function getTrendingStories(limit = 20, hoursBack = 24) {
	try {
		// Get top story IDs
		const topIds = await getTopStoryIds(50); // Get more to filter from
		
		// Fetch story details
		const stories = await getStories(topIds);
		
		// Filter for recent stories (within specified hours)
		const cutoffTime = Math.floor(Date.now() / 1000) - (hoursBack * 3600);
		const recentStories = stories.filter(story => story.time >= cutoffTime);
		
		// Sort by score (popularity) and take the top ones
		return recentStories
			.sort((a, b) => b.score - a.score)
			.slice(0, limit);
			
	} catch (error) {
		console.error('Error fetching trending stories:', error);
		throw error;
	}
}
