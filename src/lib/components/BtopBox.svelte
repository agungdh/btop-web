<script lang="ts">
	let {
		title,
		color = 'text-btop-cpu',
		children,
		right
	}: {
		title: string;
		color?: string;
		children?: import('svelte').Snippet;
		right?: import('svelte').Snippet;
	} = $props();
</script>

<div class="flex min-h-0 flex-col border border-btop-line bg-btop-bg">
	<header
		class="flex shrink-0 items-center justify-between border-b border-btop-line px-1.5 py-0.5"
	>
		<span class="text-[11px] font-bold tracking-wider uppercase {color}">{title}</span>
		<div class="flex min-w-0 items-center gap-2 text-[10px] text-btop-dim">
			{@render right?.()}
		</div>
	</header>
	<div class="min-h-0 flex-1 p-1.5">
		{@render children?.()}
	</div>
</div>
