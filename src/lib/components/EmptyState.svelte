<!-- @ts-nocheck -->
<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	function handleRefresh() {
		dispatch('refresh');
	}
</script>

<div class="text-center py-20">
	<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
		<span class="text-slate-400 text-2xl">📰</span>
	</div>
	<h3 class="text-lg font-semibold text-slate-900 mb-2">No Digest Available</h3>
	<p class="text-slate-600 mb-6">Click refresh to generate a fresh digest of trending tech stories.</p>
	<button
		on:click={handleRefresh}
		class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
	>
		Generate Digest
	</button>
</div>
