<script lang="ts">
	import { dashboard } from '$lib/api/store.svelte';
	import { formatTimestamp } from '$lib/api/format';

	const statusConfig = $derived(
		{
			connected: { dot: 'bg-emerald-500', text: 'Connected', color: 'text-emerald-400' },
			connecting: {
				dot: 'bg-amber-400 animate-pulse',
				text: 'Connecting…',
				color: 'text-amber-300'
			},
			error: { dot: 'bg-rose-500', text: 'Error', color: 'text-rose-400' },
			idle: { dot: 'bg-zinc-600', text: 'Idle', color: 'text-zinc-500' }
		}[dashboard.status]
	);
</script>

<div
	class="flex flex-wrap items-center justify-between gap-2 rounded border px-3 py-1.5 text-[11px] {dashboard.status ===
	'error'
		? 'border-rose-500/40 bg-rose-500/10'
		: 'border-zinc-800 bg-zinc-900/50'}"
>
	<div class="flex items-center gap-2">
		<span class={`inline-block size-2 rounded-full ${statusConfig.dot}`}></span>
		<span class={statusConfig.color}>{statusConfig.text}</span>
		{#if dashboard.error}
			<span class="truncate text-rose-300" title={dashboard.error}>{dashboard.error}</span>
		{/if}
	</div>
	<div class="text-zinc-500">
		{#if dashboard.lastUpdated}
			Last updated {formatTimestamp(new Date(dashboard.lastUpdated).toISOString())}
		{/if}
	</div>
</div>
