<script lang="ts">
	let {
		title,
		accent = 'bg-metric-cpu',
		children,
		right
	}: {
		title: string;
		accent?: string;
		children?: import('svelte').Snippet;
		right?: import('svelte').Snippet;
	} = $props();
</script>

<div
	class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.04)]"
>
	<header class="flex shrink-0 items-center justify-between gap-2 px-4 pt-3 pb-2">
		<div class="flex min-w-0 items-center gap-2">
			<span class={`size-1.5 shrink-0 rounded-full ${accent}`}></span>
			<h2 class="truncate text-[13px] font-semibold tracking-tight text-app-fg">{title}</h2>
		</div>
		<div class="flex min-w-0 shrink-0 items-center gap-2 text-xs text-app-dim">
			{@render right?.()}
		</div>
	</header>
	<div class="min-h-0 flex-1 px-4 pb-4">
		{@render children?.()}
	</div>
</div>
