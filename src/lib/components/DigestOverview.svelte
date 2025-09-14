<!-- @ts-nocheck -->
<script>
	export let digest;
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-2xl font-bold text-slate-900">Today's Digest</h2>
		<span class="text-sm text-slate-500">{digest.date}</span>
	</div>
	
	<p class="text-slate-700 text-sm leading-relaxed mb-4">
		{digest.overview.overview}
	</p>
</div>
