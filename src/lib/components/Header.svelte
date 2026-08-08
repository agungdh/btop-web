<script lang="ts">
	import type { Meta } from '$lib/api/types';
	import { dashboard } from '$lib/api/store.svelte';
	import { formatTimestamp, formatUptime } from '$lib/api/format';

	let { meta }: { meta: Meta } = $props();

	const status = $derived(
		{
			connected: { dot: 'bg-btop-proc-low', text: 'connected', color: 'text-btop-proc-low' },
			connecting: { dot: 'bg-btop-dim animate-pulse', text: 'connecting…', color: 'text-btop-dim' },
			error: { dot: 'bg-btop-proc-high', text: 'error', color: 'text-btop-proc-high' },
			idle: { dot: 'bg-btop-meter', text: 'idle', color: 'text-btop-dim' }
		}[dashboard.status]
	);
</script>

<header
	class="flex shrink-0 items-center justify-between gap-2 border-b border-btop-line px-2 py-1 font-mono text-[11px]"
>
	<div class="flex min-w-0 items-center gap-2">
		<span class="font-bold text-btop-cpu">btop</span>
		<span class="text-btop-dim">v{meta.version}</span>
		<span class="text-btop-dim">@{meta.hostname}</span>
		<span class="hidden truncate text-btop-dim md:inline">{meta.cpu_name}</span>
		<span class="text-btop-dim">up {formatUptime(meta.uptime)}</span>
	</div>
	<div class="flex shrink-0 items-center gap-3">
		{#if dashboard.error}
			<span class="hidden text-btop-proc-high sm:inline" title={dashboard.error}
				>{dashboard.error}</span
			>
		{/if}
		<div class="flex items-center gap-1.5">
			<span class={`inline-block size-1.5 rounded-full ${status.dot}`}></span>
			<span class={status.color}>{status.text}</span>
		</div>
		{#if dashboard.lastUpdated}
			<span class="text-btop-dim"
				>{formatTimestamp(new Date(dashboard.lastUpdated).toISOString())}</span
			>
		{/if}
	</div>
</header>
