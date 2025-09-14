<!-- @ts-nocheck -->
<script>
	export let digest = null;
</script>

{#if digest}
	<div class="mt-12 bg-slate-50 rounded-lg p-6 text-center space-y-2">
		<p class="text-slate-600 text-sm">
			{#if digest.cache_info?.cached}
				📦 Served from cache ({digest.cache_info.cache_age_minutes}mins old)
			{:else}
				🔥 Fresh digest
			{/if}
			• Generated at {#if digest.cache_info?.cached}{new Date(digest.cache_info.generated_at).toLocaleTimeString()}{:else}{new Date(digest.generated_at).toLocaleTimeString()}{/if}
		</p>
		
		<p class="text-slate-600 text-sm">
			Analyzed {digest.stats.total_stories_fetched} trending stories
		</p>
		
		<p class="text-slate-500 text-xs">
			Powered by OpenAI API • Built by <a href="https://github.com/jackdolbs" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">Jack Dolby</a>
		</p>
	</div>
{/if}