<!-- @ts-nocheck -->
<script>
	import DigestCard from './DigestCard.svelte';
	
	export let summaries = [];
</script>

<div class="space-y-4">
	{#each summaries as summary, index}
		<DigestCard {summary} {index} />
	{/each}
</div>
