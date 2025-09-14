/**
 * AI Summarization Service
 * Uses OpenAI API to generate story summaries and insights
 */

import OpenAI from 'openai';

// Initialize OpenAI client
let openai;

/**
 * Initialize OpenAI client with API key
 * @param {string} apiKey - OpenAI API key
 */
export function initializeOpenAI(apiKey) {
	if (!apiKey) {
		throw new Error('OpenAI API key is required');
	}
	
	openai = new OpenAI({
		apiKey: apiKey
	});
}

/**
 * Generate a concise summary for a tech story
 * @param {Object} story - Story object with title, url, and metadata
 * @returns {Promise<Object>} Summary object with summary text and insights
 */
export async function summarizeStory(story) {
	if (!openai) {
		throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
	}
	
	try {
		const prompt = `
You are an expert tech analyst creating concise summaries for busy tech professionals. 

Story Title: "${story.title}"
Story URL: ${story.url}
HackerNews Score: ${story.score}
Comments: ${story.descendants}

Create a 2-3 sentence summary that:
1. Explains what this story is about in simple terms
2. Highlights why it matters to the tech industry
3. Focuses on actionable insights or implications

Be concise, insightful, and focus on the "so what?" factor. Avoid jargon when possible.

Format your response as JSON:
{
  "summary": "Your 2-3 sentence summary here",
  "why_it_matters": "One sentence on why this is significant",
  "category": "One of: AI & ML, Web Development, Mobile, Cloud & Infrastructure, Startups & Business, Security, Hardware, General Tech"
}`;

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a tech industry analyst who creates concise, actionable summaries of tech news. Always respond with valid JSON."
				},
				{
					role: "user",
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 200
		});

		const response = completion.choices[0].message.content;
		
		// Parse the JSON response
		try {
			const parsed = JSON.parse(response);
			return {
				...parsed,
				original_story: story,
				generated_at: new Date().toISOString()
			};
		} catch (parseError) {
			console.error('Error parsing AI response:', parseError);
			// Fallback summary if JSON parsing fails
			return {
				summary: `${story.title} - A trending story on HackerNews with ${story.score} points and ${story.descendants} comments.`,
				why_it_matters: "This story is gaining attention in the tech community.",
				category: "General Tech",
				original_story: story,
				generated_at: new Date().toISOString()
			};
		}
		
	} catch (error) {
		console.error('Error generating summary:', error);
		
		// Fallback summary if API call fails
		return {
			summary: `${story.title} - A trending story on HackerNews with ${story.score} points and ${story.descendants} comments.`,
			why_it_matters: "This story is gaining attention in the tech community.",
			category: "General Tech",
			original_story: story,
			generated_at: new Date().toISOString(),
			error: error.message
		};
	}
}

/**
 * Generate summaries for multiple stories
 * @param {Object[]} stories - Array of story objects
 * @returns {Promise<Object[]>} Array of summary objects
 */
export async function summarizeStories(stories) {
	const summaryPromises = stories.map(story => summarizeStory(story));
	return await Promise.all(summaryPromises);
}

/**
 * Generate a digest overview for a collection of summaries
 * @param {Object[]} summaries - Array of summary objects
 * @param {string} date - Date string for the digest
 * @returns {Promise<Object>} Digest overview object
 */
export async function generateDigestOverview(summaries, date) {
	if (!openai) {
		throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
	}
	
	try {
		const storiesText = summaries.map((summary, index) => 
			`${index + 1}. ${summary.original_story.title} (${summary.category})`
		).join('\n');
		
		const prompt = `
You are creating an executive overview for a tech digest containing ${summaries.length} stories from ${date}.

Stories included:
${storiesText}

Create a brief executive summary (2-3 sentences) that:
1. Identifies the main themes or trends across these stories
2. Highlights the most significant development
3. Provides context for why these stories matter collectively

Keep it concise and executive-friendly.`;

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a tech industry analyst creating executive summaries of tech news digests."
				},
				{
					role: "user",
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 150
		});

		return {
			overview: completion.choices[0].message.content,
			story_count: summaries.length,
			date: date,
			generated_at: new Date().toISOString()
		};
		
	} catch (error) {
		console.error('Error generating digest overview:', error);
		
		// Fallback overview
		return {
			overview: `Today's digest includes ${summaries.length} trending tech stories covering various aspects of the technology industry.`,
			story_count: summaries.length,
			date: date,
			generated_at: new Date().toISOString(),
			error: error.message
		};
	}
}
