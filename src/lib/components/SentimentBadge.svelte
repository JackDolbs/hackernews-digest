<!-- @ts-nocheck -->
<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { cn } from "$lib/utils";

    export let sentiment: 'positive' | 'neutral' | 'negative' = "neutral";

    const variants: Record<typeof sentiment, string> = {
        positive: "bg-green-600 text-white hover:bg-green-700",
        neutral: "bg-slate-600 text-white hover:bg-slate-700",
        negative: "bg-red-600 text-white hover:bg-red-700"
    };

    $: badgeClass = variants[sentiment] || variants.neutral;
</script>

<Badge class={cn(badgeClass)} variant="outline">
    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
</Badge>
