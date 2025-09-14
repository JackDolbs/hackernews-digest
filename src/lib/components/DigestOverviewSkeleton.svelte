<!-- @ts-nocheck -->
<script>
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
	<div class="flex items-center justify-between mb-4">
		<Skeleton class="h-8 w-48" />
		<Skeleton class="h-5 w-24" />
	</div>
	
	<div class="space-y-2 mb-4">
		<Skeleton class="h-5 w-full" />
		<Skeleton class="h-5 w-full" />
		<Skeleton class="h-5 w-2/3" />
	</div>
	
	<div class="flex flex-wrap gap-4 text-sm text-slate-600">
		<Skeleton class="h-5 w-24" />
		<Skeleton class="h-5 w-24" />
		<Skeleton class="h-5 w-36" />
	</div>
</div>
