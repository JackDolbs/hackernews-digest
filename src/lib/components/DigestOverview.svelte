<!-- @ts-nocheck -->
<script>
	export let digest;
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-2xl font-bold text-slate-900">Today's Digest</h2>
		<span class="text-sm text-slate-500">{digest.date}</span>
	</div>
	
	<p class="text-slate-700 text-md leading-relaxed mb-4">
		{digest.overview.overview}
	</p>
	
	<div class="flex flex-wrap gap-4 text-sm text-slate-600">
		<div class="flex items-center space-x-2">
			<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
			<span>{digest.stats.stories_summarized} stories</span>
		</div>
		<div class="flex items-center space-x-2">
			<span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
			<span>{digest.stats.categories_found} categories</span>
		</div>
	</div>
</div>
