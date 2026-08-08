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

<div class="flex h-full flex-col gap-1">
	<div class="h-12 min-w-0">
		<Chart values={usedHistory} max={100} height={48} color="#d9626d" />
	</div>
	<div class="flex items-baseline justify-between font-mono text-[10px]">
		<span class="text-btop-title">Total</span>
		<span class="text-btop-dim">{formatBytes(totalBytes)}</span>
	</div>
	<div class="flex flex-col gap-0.5">
		<Meter
			value={usedPct}
			label="used"
			start="#592b26"
			mid="#d9626d"
			end="#ff4769"
			valueText={`${formatBytes(mem.stats.used)} (${formatPercent(usedPct, 1)})`}
		/>
		<Meter
			value={availPct}
			label="avail"
			start="#4e3f0e"
			mid="#ffd77a"
			end="#ffb814"
			valueText={`${formatBytes(mem.stats.available)} (${formatPercent(availPct, 1)})`}
		/>
		<Meter
			value={cachedPct}
			label="cached"
			start="#163350"
			mid="#74e6fc"
			end="#26c5ff"
			valueText={`${formatBytes(mem.stats.cached)} (${formatPercent(cachedPct, 1)})`}
		/>
		<Meter
			value={freePct}
			label="free"
			start="#384f21"
			mid="#b5e685"
			end="#dcff85"
			valueText={`${formatBytes(mem.stats.free)} (${formatPercent(freePct, 1)})`}
		/>
		{#if mem.stats.swap_total > 0}
			<div class="mt-0.5 border-t border-btop-line pt-0.5">
				<Meter
					value={swapPct}
					label="swap"
					start="#620665"
					mid="#7d4180"
					end="#dcafde"
					valueText={`${formatBytes(mem.stats.swap_used)} / ${formatBytes(mem.stats.swap_total)}`}
				/>
			</div>
		{/if}
	</div>
</div>
