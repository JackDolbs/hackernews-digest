<!-- @ts-nocheck -->
<script>
	import { createEventDispatcher } from 'svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	
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
	
	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			window.location.href = '/login';
		} catch (e) {
			console.error('Logout failed', e);
		}
	}
</script>

<header class="bg-white border-b border-slate-200 sticky top-0 z-10">
	<div class="max-w-4xl mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex flex-col items-start">
				<img src="/causaLens.svg" alt="CausaLens Logo" class="h-8 w-auto mb-2" />
				<p class="text-sm text-slate-600">Digesting tech stories that matter</p>
			</div>
			<div class="flex items-center gap-2 text-sm">
				<DropdownMenu>
					<DropdownMenuTrigger class="flex items-center text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 border rounded-md">
						Actions
						<svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="min-w-[180px]">
						<DropdownMenuItem class="cursor-pointer" disabled={loading}>
							<button type="button" class="flex items-center w-full text-left" on:click={handleRefresh}>
								<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
								{loading ? 'Loading…' : 'Refresh Feed'}
							</button>
						</DropdownMenuItem>
						<DropdownMenuItem class="cursor-pointer" disabled={loading}>
							<button type="button" class="flex items-center w-full text-left" on:click={handleClearCache}>
								<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
								Clear Cache
							</button>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem class="cursor-pointer text-red-600">
							<button type="button" class="flex items-center w-full text-left" on:click={handleLogout}>
								<svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
								Log out
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	</div>
</header>