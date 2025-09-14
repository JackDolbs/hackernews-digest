<!-- @ts-nocheck -->
<script>
	import { onMount } from 'svelte';
	import DigestCard from '$lib/components/DigestCard.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	
	let digest = null;
	let loading = false;
	let error = null;
	
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
		} catch (err) {
			error = err.message;
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

<svelte:head>
	<title>HackerNews AI Digest</title>
	<meta name="description" content="AI-powered daily digest of trending tech stories from HackerNews" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<!-- Header -->
	<header class="bg-white border-b border-slate-200 sticky top-0 z-10">
		<div class="max-w-4xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-sm">HN</span>
					</div>
					<div>
						<h1 class="text-xl font-bold text-slate-900">AI Digest</h1>
						<p class="text-sm text-slate-600">Tech stories that matter</p>
					</div>
				</div>
				<button
					on:click={loadDigest}
					disabled={loading}
					class="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
				>
					{loading ? 'Loading...' : 'Refresh'}
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-4xl mx-auto px-4 py-6">
		{#if loading}
			<div class="flex flex-col items-center justify-center py-20">
				<LoadingSpinner />
				<p class="mt-4 text-slate-600">Analyzing trending tech stories...</p>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
				<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-red-600 text-xl">⚠️</span>
				</div>
				<h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Digest</h3>
				<p class="text-red-700 mb-4">{error}</p>
				<button
					on:click={loadDigest}
					class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
				>
					Try Again
				</button>
			</div>
		{:else if digest}
			<!-- Digest Overview -->
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-slate-900">Today's Digest</h2>
					<span class="text-sm text-slate-500">{digest.date}</span>
				</div>
				
				<p class="text-slate-700 text-lg leading-relaxed mb-4">
					{digest.overview.overview}
				</p>
				
				<div class="flex flex-wrap gap-4 text-sm text-slate-600">
					<div class="flex items-center space-x-2">
						<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
						<span>{digest.stats.stories_summarized} stories</span>
					</div>
					<div class="flex items-center space-x-2">
						<span class="w-2 h-2 bg-green-500 rounded-full"></span>
						<span>{digest.stats.categories_found} categories</span>
					</div>
					<div class="flex items-center space-x-2">
						<span class="w-2 h-2 bg-purple-500 rounded-full"></span>
						<span>AI-powered summaries</span>
					</div>
				</div>
			</div>

			<!-- Story Cards -->
			<div class="space-y-4">
				{#each digest.summaries as summary, index}
					<DigestCard {summary} {index} />
				{/each}
			</div>

			<!-- Footer Stats -->
			<div class="mt-12 bg-slate-50 rounded-lg p-6 text-center">
				<p class="text-slate-600 text-sm">
					Generated at {new Date(digest.generated_at).toLocaleTimeString()} • 
					Analyzed {digest.stats.total_stories_fetched} trending stories • 
					Powered by OpenAI API •
                    Built by Jack Dolby
				</p>
			</div>
		{:else}
			<div class="text-center py-20">
				<p class="text-slate-600">No digest available. Click refresh to generate one.</p>
			</div>
		{/if}
	</main>
</div>