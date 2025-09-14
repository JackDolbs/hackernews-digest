<!-- @ts-nocheck -->
<script>
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<article class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
	<!-- Header -->
	<div class="p-6 pb-4">
		<div class="flex items-start justify-between mb-3">
			<Skeleton class="h-6 w-8" />
			<Skeleton class="h-6 w-24" />
		</div>
		
		<div class="space-y-2">
			<Skeleton class="h-6 w-full" />
			<Skeleton class="h-6 w-3/4" />
		</div>
		
		<!-- Story Metadata -->
		<div class="flex items-center space-x-4 mt-4 text-sm text-slate-500">
			<Skeleton class="h-5 w-16" />
			<Skeleton class="h-5 w-16" />
			<Skeleton class="h-5 w-24" />
			<Skeleton class="h-5 w-16" />
		</div>
	</div>
	
	<!-- AI Summary -->
	<div class="px-6 pb-6">
		<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
			<div class="flex items-center space-x-2 mb-2">
				<span class="w-5 h-5 text-blue-500">🤖</span>
				<span class="text-sm font-medium text-blue-800">AI Summary</span>
			</div>
			
			<div class="space-y-2">
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-2/3" />
			</div>
			
			<div class="bg-white/50 rounded-md p-3 border border-blue-200 mt-3">
				<div class="space-y-2">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
				</div>
			</div>
		</div>
	</div>
	
	<!-- Footer Actions -->
	<div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
		<div class="flex items-center justify-between">
			<Skeleton class="h-5 w-24" />
			<Skeleton class="h-5 w-24" />
		</div>
	</div>
</article>
