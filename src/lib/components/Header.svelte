<!-- @ts-nocheck -->
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
			<div class="flex items-center space-x-3">
				<div class="flex flex-col items-start">
					<img src="/causaLens.svg" alt="CausaLens Logo" class="h-8 w-auto mb-2" />
					<p class="text-sm text-slate-600">Digesting tech stories that matter</p>
				</div>
			</div>
			<div class="flex items-center space-x-2">
				<button
					on:click={handleClearCache}
					disabled={loading}
					class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
				>
					Clear Cache
				</button>
				<button
					on:click={handleRefresh}
					disabled={loading}
					class="px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 disabled:opacity-50 transition-colors"
				>
					{loading ? 'Loading...' : 'Refresh Feed'}
				</button>
			</div>
		</div>
	</div>
</header>
