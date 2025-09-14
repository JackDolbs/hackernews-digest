<div class="flex items-center justify-center">
	<div class="relative">
		<!-- Outer ring -->
		<div class="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
		<!-- Spinning inner ring -->
		<div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
	</div>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
