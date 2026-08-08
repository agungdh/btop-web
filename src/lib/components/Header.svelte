<script lang="ts">
	import type { Meta } from '$lib/api/types';
	import { dashboard } from '$lib/api/store.svelte';
	import { formatTimestamp, formatUptime } from '$lib/api/format';

	let { meta }: { meta: Meta } = $props();

	const status = $derived(
		{
			connected: {
				dot: 'bg-proc-low',
				text: 'connected',
				color: 'text-proc-low'
			},
			connecting: {
				dot: 'bg-app-dim animate-pulse',
				text: 'connecting…',
				color: 'text-app-dim'
			},
			error: {
				dot: 'bg-proc-high',
				text: 'error',
				color: 'text-proc-high'
			},
			idle: {
				dot: 'bg-app-mute',
				text: 'idle',
				color: 'text-app-dim'
			}
		}[dashboard.status]
	);
</script>

<header
	class="flex shrink-0 items-center justify-between gap-3 border-b border-app-border bg-app-bg/80 px-4 py-2.5 backdrop-blur"
>
	<div class="flex min-w-0 items-center gap-2.5">
		<span class="text-sm font-bold tracking-tight text-app-fg">btop</span>
		<span
			class="hidden rounded-md border border-app-border bg-app-card px-1.5 py-0.5 text-[10px] font-medium text-app-dim sm:inline"
			>v{meta.version}</span
		>
		<span class="min-w-0 truncate text-sm text-app-dim">@{meta.hostname}</span>
		<span class="hidden truncate text-xs text-app-mute lg:inline">{meta.cpu_name}</span>
		<span class="hidden text-xs text-app-mute md:inline">up {formatUptime(meta.uptime)}</span>
	</div>
	<div class="flex shrink-0 items-center gap-2.5">
		{#if dashboard.error}
			<span class="hidden text-xs text-proc-high sm:inline" title={dashboard.error}
				>{dashboard.error}</span
			>
		{/if}
		<span
			class="flex items-center gap-1.5 rounded-full border border-app-border bg-app-card px-2 py-0.5 text-[10px] font-medium {status.color}"
		>
			<span class={`size-1.5 rounded-full ${status.dot}`}></span>
			{status.text}
		</span>
		{#if dashboard.lastUpdated}
			<span class="hidden text-xs text-app-mute sm:inline"
				>{formatTimestamp(new Date(dashboard.lastUpdated).toISOString())}</span
			>
		{/if}
	</div>
</header>
