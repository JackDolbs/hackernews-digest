<!-- @ts-nocheck -->
<script>
	export let summary;
	export let index;
	
	// Category color mapping
	const categoryColors = {
		'AI & ML': 'bg-purple-100 text-purple-800 border-purple-200',
		'Web Development': 'bg-blue-100 text-blue-800 border-blue-200',
		'Mobile': 'bg-green-100 text-green-800 border-green-200',
		'Cloud & Infrastructure': 'bg-indigo-100 text-indigo-800 border-indigo-200',
		'Startups & Business': 'bg-orange-100 text-orange-800 border-orange-200',
		'Security': 'bg-red-100 text-red-800 border-red-200',
		'Hardware': 'bg-gray-100 text-gray-800 border-gray-200',
		'General Tech': 'bg-slate-100 text-slate-800 border-slate-200'
	};
	
	$: categoryStyle = categoryColors[summary.category] || categoryColors['General Tech'];
	$: story = summary.original_story;
	
	function formatScore(score) {
		if (score >= 1000) {
			return `${(score / 1000).toFixed(1)}k`;
		}
		return score.toString();
	}
	
	function formatTime(timestamp) {
		const date = new Date(timestamp * 1000);
		const now = new Date();
		const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
		
		if (diffHours < 1) return 'Just now';
		if (diffHours === 1) return '1 hour ago';
		if (diffHours < 24) return `${diffHours} hours ago`;
		
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays === 1) return '1 day ago';
		return `${diffDays} days ago`;
	}
</script>

<article class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
	<!-- Header -->
	<div class="p-6 pb-4">
		<div class="flex items-start justify-between mb-3">
			<span class="text-2xl font-bold text-slate-400">
				{String(index + 1).padStart(2, '0')}
			</span>
			<span class="px-3 py-1 text-xs font-medium rounded-full border {categoryStyle}">
				{summary.category}
			</span>
		</div>
		
		<h3 class="text-lg font-semibold text-slate-900 leading-tight mb-3">
			<a 
				href={story.url} 
				target="_blank" 
				rel="noopener noreferrer"
				class="hover:text-orange-600 transition-colors"
			>
				{story.title}
			</a>
		</h3>
		
		<!-- Story Metadata -->
		<div class="flex items-center space-x-4 text-sm text-slate-500 mb-4">
			<div class="flex items-center space-x-1">
				<span class="w-4 h-4 text-orange-500">▲</span>
				<span>{formatScore(story.score)}</span>
			</div>
			<div class="flex items-center space-x-1">
				<span class="w-4 h-4">💬</span>
				<span>{story.descendants}</span>
			</div>
			<div class="flex items-center space-x-1">
				<span class="w-4 h-4">⏰</span>
				<span>{formatTime(story.time)}</span>
			</div>
			<div class="flex items-center space-x-1">
				<span class="w-4 h-4">👤</span>
				<span>{story.by}</span>
			</div>
		</div>
	</div>
	
	<!-- AI Summary -->
	<div class="px-6 pb-6">
		<div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
			<div class="flex items-center space-x-2 mb-2">
				<span class="w-5 h-5 text-orange-500">🤖</span>
				<span class="text-sm font-medium text-orange-800">AI Summary</span>
			</div>
			
			<p class="text-slate-700 leading-relaxed mb-3">
				{summary.summary}
			</p>
			
			<div class="bg-white/50 rounded-md p-3 border border-orange-200">
				<p class="text-sm text-slate-600">
					<span class="font-medium text-orange-700">Why it matters:</span>
					{summary.why_it_matters}
				</p>
			</div>
		</div>
	</div>
	
	<!-- Footer Actions -->
	<div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
		<div class="flex items-center justify-between">
			<a 
				href={story.url}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center space-x-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
			>
				<span>Read Original</span>
				<span class="w-4 h-4">↗</span>
			</a>
			
			<a 
				href="https://news.ycombinator.com/item?id={story.id}"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors"
			>
				<span>HN Discussion</span>
				<span class="w-4 h-4">💬</span>
			</a>
		</div>
	</div>
</article>
