<!-- @ts-nocheck -->
<script>
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import DigestOverview from '$lib/components/DigestOverview.svelte';
	import StoryGrid from '$lib/components/StoryGrid.svelte';
	import LoadingState from '$lib/components/LoadingState.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
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

<!-- Header -->
<Header {loading} on:refresh={loadDigest} />

<!-- Main Content -->
<main class="max-w-4xl mx-auto px-4 py-6">
	{#if loading}
		<LoadingState />
	{:else if error}
		<ErrorState {error} on:retry={loadDigest} />
	{:else if digest}
		<!-- Digest Overview -->
		<DigestOverview {digest} />

		<!-- Story Cards -->
		<StoryGrid summaries={digest.summaries} />

		<!-- Footer Stats -->
		<Footer {digest} />
	{:else}
		<EmptyState on:refresh={loadDigest} />
	{/if}
</main>