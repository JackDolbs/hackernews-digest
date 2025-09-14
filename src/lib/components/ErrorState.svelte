<!-- @ts-nocheck -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	export let error;
	
	const dispatch = createEventDispatcher();
	
	function handleRetry() {
		dispatch('retry');
	}
</script>

<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
	<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
		<span class="text-red-600 text-xl">⚠️</span>
	</div>
	<h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Digest</h3>
	<p class="text-red-700 mb-4">{error}</p>
	<button
		on:click={handleRetry}
		class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
	>
		Try Again
	</button>
</div>
