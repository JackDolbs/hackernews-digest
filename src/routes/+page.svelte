<!-- @ts-nocheck -->
<script>
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
	
	let digest = null;
	let loading = true; // Start with loading state
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
			<DigestOverview {digest} />

			<!-- Story Cards -->
			<StoryGrid summaries={digest.summaries} />

			<!-- Footer Stats -->
			<Footer {digest} />
		</div>
	{:else}
		<div in:fade={{ duration: 300 }}>
			<EmptyState on:refresh={loadDigest} />
		</div>
	{/if}
</main>