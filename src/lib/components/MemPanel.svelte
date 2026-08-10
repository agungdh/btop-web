<script lang="ts">
	import type { MemSection } from '$lib/api/types';
	import { formatBytes, formatPercent } from '$lib/api/format';
	import { normalizeMemStats } from '$lib/api/normalize';
	import Chart from './Chart.svelte';
	import Meter from './Meter.svelte';

	let { mem }: { mem: MemSection } = $props();

	const stats = $derived(normalizeMemStats(mem.stats));
	const totalBytes = $derived(stats.total);
	const usedHistory = $derived(mem.percent.used ?? []);
	const usedPct = $derived((stats.used / Math.max(totalBytes, 1)) * 100);
	const availPct = $derived((stats.available / Math.max(totalBytes, 1)) * 100);
	const cachedPct = $derived((stats.cached / Math.max(totalBytes, 1)) * 100);
	const freePct = $derived((stats.free / Math.max(totalBytes, 1)) * 100);
	const swapPct = $derived((stats.swap_used / Math.max(stats.swap_total, 1)) * 100);
</script>

<div class="flex h-full flex-col gap-2.5">
	<div class="h-8">
		<Chart values={usedHistory} max={100} height={32} color="#f43f5e" />
	</div>

	<div class="flex items-baseline justify-between">
		<div class="text-[11px] font-medium text-app-dim">Total memory</div>
		<div class="text-[13px] font-semibold text-app-fg tabular-nums">{formatBytes(totalBytes)}</div>
	</div>

	<div class="flex flex-col gap-2">
		<Meter
			value={usedPct}
			label="used"
			start="#f43f5e"
			mid="#f43f5e"
			end="#f43f5e"
			height={5}
			valueText={`${formatBytes(stats.used)} (${formatPercent(usedPct, 1)})`}
		/>
		<Meter
			value={availPct}
			label="avail"
			start="#f59e0b"
			mid="#f59e0b"
			end="#f59e0b"
			height={5}
			valueText={`${formatBytes(stats.available)} (${formatPercent(availPct, 1)})`}
		/>
		<Meter
			value={cachedPct}
			label="cached"
			start="#38bdf8"
			mid="#38bdf8"
			end="#38bdf8"
			height={5}
			valueText={`${formatBytes(stats.cached)} (${formatPercent(cachedPct, 1)})`}
		/>
		<Meter
			value={freePct}
			label="free"
			start="#34d399"
			mid="#34d399"
			end="#34d399"
			height={5}
			valueText={`${formatBytes(stats.free)} (${formatPercent(freePct, 1)})`}
		/>
		{#if stats.swap_total > 0}
			<div class="border-t border-app-border pt-2">
				<Meter
					value={swapPct}
					label="swap"
					start="#c084fc"
					mid="#c084fc"
					end="#c084fc"
					height={5}
					valueText={`${formatBytes(stats.swap_used)} / ${formatBytes(stats.swap_total)}`}
				/>
			</div>
		{/if}
	</div>
</div>
