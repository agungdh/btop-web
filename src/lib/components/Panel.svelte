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

<section class="flex flex-col gap-3 rounded-2xl border border-app-border bg-app-card p-4">
	<header class="flex items-baseline justify-between gap-2 border-b border-app-border pb-2">
		<div class="flex min-w-0 items-baseline gap-2">
			<h2 class="shrink-0 text-xs font-semibold tracking-tight text-app-fg">{title}</h2>
			{#if subtitle}<span class="truncate text-[11px] text-app-mute">{subtitle}</span>{/if}
		</div>
		<div class="flex shrink-0 items-center gap-2 text-[11px] text-app-dim">
			{@render actions?.()}
		</div>
	</header>
	<div class="min-h-0 flex-1">
		{@render children?.()}
	</div>
</section>
