<script>
	import { createEventDispatcher } from 'svelte';
	
	export let loading = false;
	
	const dispatch = createEventDispatcher();
	
	async function handleClearCache() {
		try {
			const response = await fetch('/api/cache/clear', { method: 'POST' });
			if (!response.ok) throw new Error('Failed to clear cache');
			dispatch('refresh'); // Refresh after clearing cache
		} catch (error) {
			console.error('Error clearing cache:', error);
		}
	}
	
	function handleRefresh() {
		dispatch('refresh');
	}
</script>

<header class="bg-white border-b border-slate-200 sticky top-0 z-10">
	<div class="max-w-4xl mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex flex-col items-start">
				<img src="/causaLens.svg" alt="CausaLens Logo" class="h-8 w-auto mb-2" />
				<p class="text-sm text-slate-600">Digesting tech stories that matter</p>
			</div>
			<div class="flex flex-col items-end gap-2 text-sm">
				<button
					on:click={handleRefresh}
					disabled={loading}
					class="flex items-center text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
				>
					<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
						<path d="M21 3v5h-5"/>
					</svg>
					{loading ? 'Loading...' : 'Refresh Feed'}
				</button>
				<button
					on:click={handleClearCache}
					disabled={loading}
					class="flex items-center text-slate-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
				>
					<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
						<line x1="8" y1="12" x2="16" y2="12"/>
					</svg>
					Clear Cache
				</button>
			</div>
		</div>
	</div>
</header>