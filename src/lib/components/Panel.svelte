<script lang="ts">
	let {
		title,
		subtitle = '',
		children,
		actions
	}: {
		title: string;
		subtitle?: string;
		children?: import('svelte').Snippet;
		actions?: import('svelte').Snippet;
	} = $props();
</script>

<section class="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
	<header class="flex items-baseline justify-between gap-2 border-b border-zinc-800 pb-1.5">
		<div class="flex min-w-0 items-baseline gap-2">
			<h2 class="shrink-0 text-xs font-bold tracking-wider text-zinc-300 uppercase">{title}</h2>
			{#if subtitle}<span class="truncate text-[10px] text-zinc-500">{subtitle}</span>{/if}
		</div>
		<div class="flex shrink-0 items-center gap-2 text-[10px] text-zinc-500">
			{@render actions?.()}
		</div>
	</header>
	<div class="min-h-0 flex-1">
		{@render children?.()}
	</div>
</section>
