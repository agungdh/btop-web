<script lang="ts">
	export interface TabItem {
		key: string;
		label: string;
		text: string;
		bar: string;
		value: string;
	}

	let {
		items,
		active,
		onselect
	}: {
		items: TabItem[];
		active: string;
		onselect: (key: string) => void;
	} = $props();
</script>

<nav
	class="flex shrink-0 border-t border-btop-line bg-btop-bg md:hidden"
	style:padding-bottom="env(safe-area-inset-bottom)"
	aria-label="dashboard sections"
>
	{#each items as item (item.key)}
		<button
			class="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 pt-1 pb-1 font-mono leading-none transition-opacity"
			class:opacity-60={active !== item.key}
			onclick={() => onselect(item.key)}
			aria-current={active === item.key ? 'page' : undefined}
		>
			<span
				class="absolute top-0 left-0 h-0.5 w-full transition-colors {active === item.key
					? item.bar
					: 'bg-transparent'}"
			></span>
			<span
				class="text-[9px] font-bold tracking-wider {active === item.key
					? item.text
					: 'text-btop-dim'}"
			>
				{item.label}
			</span>
			<span class="max-w-full truncate text-[9px] text-btop-dim">{item.value}</span>
		</button>
	{/each}
</nav>
