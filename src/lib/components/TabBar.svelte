<script lang="ts">
	export interface TabItem {
		key: string;
		label: string;
		accent: string;
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

{#snippet icon(key: string)}
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if key === 'cpu'}
			<rect x="4" y="4" width="16" height="16" rx="2" />
			<rect x="9" y="9" width="6" height="6" rx="1" />
			<path d="M9 1v2M15 1v2M9 21v2M15 21v2M1 9h2M1 15h2M21 9h2M21 15h2" />
		{:else if key === 'mem'}
			<rect x="5" y="2" width="14" height="20" rx="2" />
			<path d="M9 2v20M15 2v20" />
		{:else if key === 'net'}
			<path d="M12 20V5M12 5l-4.5 4.5M12 5l4.5 4.5" />
			<path d="M4 20h16" />
		{:else if key === 'disk'}
			<ellipse cx="12" cy="5.5" rx="8" ry="2.5" />
			<path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13" />
			<path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" />
		{:else if key === 'gpu'}
			<rect x="4" y="4" width="16" height="16" rx="2" />
			<circle cx="12" cy="12" r="3" />
		{:else if key === 'proc'}
			<path d="M8 6h8M8 12h8M8 18h5" />
		{/if}
	</svg>
{/snippet}

<nav
	class="shrink-0 border-t border-app-border bg-app-bg/95 px-1.5 pt-1 backdrop-blur md:hidden"
	style:padding-bottom="env(safe-area-inset-bottom)"
	aria-label="dashboard sections"
>
	<div class="flex items-end gap-0.5">
		{#each items as item (item.key)}
			<button
				class="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 pt-1.5 pb-1.5 transition-colors select-none"
				class:bg-app-card={active === item.key}
				onclick={() => onselect(item.key)}
				aria-current={active === item.key ? 'page' : undefined}
			>
				<span
					class="flex items-center justify-center {active === item.key
						? 'text-' + item.accent
						: 'text-app-mute'}"
				>
					{@render icon(item.key)}
				</span>
				<span
					class="text-[10px] leading-none font-medium {active === item.key
						? 'text-app-fg'
						: 'text-app-dim'}"
				>
					{item.label}
				</span>
				<span class="max-w-full truncate text-[9px] leading-none text-app-mute">{item.value}</span>
			</button>
		{/each}
	</div>
</nav>
