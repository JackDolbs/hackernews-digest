<!-- @ts-nocheck -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value = "trending";

    const sortOptions = [
        { value: "trending", label: "Trending" },
        { value: "upvotes", label: "Most Upvoted" },
        { value: "comments", label: "Most Discussed" },
        { value: "latest", label: "Latest First" }
    ];

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        value = select.value;
        dispatch('sort', { value: select.value });
    }
</script>

<div class="flex items-center gap-8">
    <div class="flex items-center gap-3 shrink-0">
        <span class="text-sm text-slate-500">Sort by:</span>
        <select
            {value}
            on:change={handleChange}
            class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
        >
            {#each sortOptions as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </div>
    <div class="flex items-center gap-4 flex-grow">
        <div class="h-px flex-grow bg-gradient-to-r from-transparent to-slate-200"></div>
        <p class="text-sm text-slate-400 text-center whitespace-nowrap">Pull down to refresh</p>
        <div class="h-px flex-grow bg-gradient-to-l from-transparent to-slate-200"></div>
    </div>
</div>