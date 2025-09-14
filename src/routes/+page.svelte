<!-- @ts-nocheck -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import DigestOverview from '$lib/components/DigestOverview.svelte';
	import DigestOverviewSkeleton from '$lib/components/DigestOverviewSkeleton.svelte';
	import StoryGrid from '$lib/components/StoryGrid.svelte';
	import DigestCardSkeleton from '$lib/components/DigestCardSkeleton.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DigestSort from '$lib/components/DigestSort.svelte';
	
	interface Story {
		title: string;
		url: string;
		score: number;
		descendants: number;
		time: number;
		id: string;
	}

	interface Summary {
		original_story: Story;
		summary: string;
		why_it_matters: string;
		category: string;
		sentiment?: string;
		sentiment_reason?: string;
	}

	interface Digest {
		summaries: Summary[];
		overview: string;
		stats: {
			total_stories_fetched: number;
			categories_found: number;
		};
		generated_at: string;
		cache_info?: {
			cached: boolean;
			generated_at: string;
			served_from_cache_at: string;
			cache_age_minutes: number;
		};
	}

	let digest: Digest | null = null;
	let loading = true; // Start with loading state
	let error: string | null = null;
	let sortOrder: "trending" | "upvotes" | "comments" | "latest" = "trending";

	function sortStories(stories: Summary[] | null, order: typeof sortOrder): Summary[] | null {
		if (!stories) return stories;
		
		const sorted = [...stories];
		switch (order) {
			case "upvotes":
				return sorted.sort((a, b) => b.original_story.score - a.original_story.score);
			case "comments":
				return sorted.sort((a, b) => b.original_story.descendants - a.original_story.descendants);
			case "latest":
				return sorted.sort((a, b) => b.original_story.time - a.original_story.time);
			case "trending":
				// Combine score, comments, and recency for a trending score
				return sorted.sort((a, b) => {
					const now = Date.now() / 1000;
					const aAge = now - a.original_story.time;
					const bAge = now - b.original_story.time;
					const aScore = (a.original_story.score + a.original_story.descendants * 2) / Math.sqrt(aAge);
					const bScore = (b.original_story.score + b.original_story.descendants * 2) / Math.sqrt(bAge);
					return bScore - aScore;
				});
			default:
				return sorted;
		}
	}

	$: sortedDigest = digest ? {
		...digest,
		summaries: sortStories(digest.summaries, sortOrder)
	} : null;
	
	async function loadDigest() {
		loading = true;
		error = null;
		
		try {
			const response = await fetch('/api/digest?limit=12&hours=24');
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.error || 'Failed to load digest');
			}
			
			digest = data;
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			console.error('Error loading digest:', err);
		} finally {
			loading = false;
		}
	}
	
	onMount(() => {
		// Auto-load digest on page load
		loadDigest();
	});
</script>

<!-- Header -->
<Header {loading} on:refresh={loadDigest} />

<!-- Main Content -->
<main class="max-w-4xl mx-auto px-4 py-6">
	{#if loading}
		<!-- Loading Skeletons -->
		<div in:fade={{ duration: 300 }} out:fade={{ duration: 500, delay: 300 }}>
			<DigestOverviewSkeleton />
			<div class="space-y-4">
				{#each Array(3) as _, i}
					<DigestCardSkeleton />
				{/each}
			</div>
		</div>
	{:else if error}
		<div in:fade={{ duration: 300 }}>
			<ErrorState {error} on:retry={loadDigest} />
		</div>
	{:else if digest}
		<div in:fade={{ duration: 300 }}>
			<!-- Digest Overview -->
			<DigestOverview digest={sortedDigest} />

			<!-- Sort Control -->
			<div class="mt-8 mb-6">
				<DigestSort value={sortOrder} on:sort={(e) => sortOrder = e.detail.value} />
			</div>

			<!-- Story Cards -->
			<StoryGrid summaries={sortedDigest.summaries} />

			<!-- Footer Stats -->
			<Footer {digest} />
		</div>
	{:else}
		<div in:fade={{ duration: 300 }}>
			<EmptyState on:refresh={loadDigest} />
		</div>
	{/if}
</main>