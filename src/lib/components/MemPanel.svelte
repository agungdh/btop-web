<script lang="ts">
	import type { MemSection } from '$lib/api/types';
	import { formatBytes, formatPercent } from '$lib/api/format';
	import Chart from './Chart.svelte';
	import Meter from './Meter.svelte';

	let { mem }: { mem: MemSection } = $props();

	const totalBytes = $derived(mem.stats.used + mem.stats.free + mem.stats.cached);
	const usedHistory = $derived(mem.percent.used ?? []);
	const usedPct = $derived((mem.stats.used / Math.max(totalBytes, 1)) * 100);
	const availPct = $derived((mem.stats.available / Math.max(totalBytes, 1)) * 100);
	const cachedPct = $derived((mem.stats.cached / Math.max(totalBytes, 1)) * 100);
	const freePct = $derived((mem.stats.free / Math.max(totalBytes, 1)) * 100);
	const swapPct = $derived((mem.stats.swap_used / Math.max(mem.stats.swap_total, 1)) * 100);
</script>

<div class="flex h-full min-h-0 flex-col gap-3 overflow-y-auto">
	<div class="h-12">
		<Chart values={usedHistory} max={100} height={48} color="#f43f5e" />
	</div>

	<div class="flex items-baseline justify-between">
		<div class="text-[11px] font-medium text-app-dim">Total memory</div>
		<div class="text-sm font-semibold text-app-fg tabular-nums">{formatBytes(totalBytes)}</div>
	</div>

	<div class="flex flex-col gap-2.5">
		<Meter
			value={usedPct}
			label="used"
			start="#f43f5e"
			mid="#f43f5e"
			end="#f43f5e"
			valueText={`${formatBytes(mem.stats.used)} (${formatPercent(usedPct, 1)})`}
		/>
		<Meter
			value={availPct}
			label="avail"
			start="#f59e0b"
			mid="#f59e0b"
			end="#f59e0b"
			valueText={`${formatBytes(mem.stats.available)} (${formatPercent(availPct, 1)})`}
		/>
		<Meter
			value={cachedPct}
			label="cached"
			start="#38bdf8"
			mid="#38bdf8"
			end="#38bdf8"
			valueText={`${formatBytes(mem.stats.cached)} (${formatPercent(cachedPct, 1)})`}
		/>
		<Meter
			value={freePct}
			label="free"
			start="#34d399"
			mid="#34d399"
			end="#34d399"
			valueText={`${formatBytes(mem.stats.free)} (${formatPercent(freePct, 1)})`}
		/>
		{#if mem.stats.swap_total > 0}
			<div class="border-t border-app-border pt-2.5">
				<Meter
					value={swapPct}
					label="swap"
					start="#c084fc"
					mid="#c084fc"
					end="#c084fc"
					valueText={`${formatBytes(mem.stats.swap_used)} / ${formatBytes(mem.stats.swap_total)}`}
				/>
			</div>
		{/if}
	</div>
</div>
