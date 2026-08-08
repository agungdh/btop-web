<script lang="ts">
	import type { MemSection } from '$lib/api/types';
	import { formatBytes, formatPercent } from '$lib/api/format';
	import Chart from './Chart.svelte';
	import Gauge from './Gauge.svelte';
	import Bar from './Bar.svelte';

	let { mem } = $props<{ mem: MemSection }>();

	const totalBytes = $derived(mem.stats.used + mem.stats.free + mem.stats.cached);
	const memPct = $derived((mem.stats.used / Math.max(totalBytes, 1)) * 100);
	const swapPct = $derived((mem.stats.swap_used / Math.max(mem.stats.swap_total, 1)) * 100);
	const usedHistory = $derived(mem.percent.used ?? []);
	const swapHistory = $derived(mem.percent.swap_used ?? []);
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-4">
		<Gauge value={memPct} label="Mem" sublabel={formatPercent(memPct)} color="#60a5fa" />
		<div class="h-16 min-w-0 flex-1">
			<Chart values={usedHistory} max={100} color="#60a5fa" />
		</div>
	</div>

	{#if mem.stats.swap_total > 0}
		<div class="flex items-center gap-4">
			<Gauge value={swapPct} label="Swap" sublabel={formatPercent(swapPct)} color="#a78bfa" />
			<div class="h-12 min-w-0 flex-1">
				<Chart values={swapHistory} max={100} color="#a78bfa" />
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Used</span>
			<span class="font-mono text-zinc-200">{formatBytes(mem.stats.used)}</span>
		</div>
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Available</span>
			<span class="font-mono text-zinc-200">{formatBytes(mem.stats.available)}</span>
		</div>
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Cached</span>
			<span class="font-mono text-zinc-200">{formatBytes(mem.stats.cached)}</span>
		</div>
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Free</span>
			<span class="font-mono text-zinc-200">{formatBytes(mem.stats.free)}</span>
		</div>
		{#if mem.stats.swap_total > 0}
			<div class="flex justify-between gap-2">
				<span class="text-zinc-500">Swap</span>
				<span class="font-mono text-zinc-200"
					>{formatBytes(mem.stats.swap_used)} / {formatBytes(mem.stats.swap_total)}</span
				>
			</div>
		{/if}
	</div>

	{#if mem.disks.length}
		<div class="flex flex-col gap-2 border-t border-zinc-800 pt-2">
			<div class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Disks</div>
			{#each mem.disks as disk (disk.dev)}
				<div class="flex flex-col gap-1">
					<div class="flex items-baseline justify-between gap-2 text-[11px]">
						<span class="truncate text-zinc-300">{disk.name || disk.dev}</span>
						<span class="shrink-0 font-mono text-zinc-400"
							>{formatBytes(disk.used)} / {formatBytes(disk.total)} ({formatPercent(
								disk.used_percent
							)})</span
						>
					</div>
					<Bar value={disk.used_percent} color="bg-amber-500" height="h-1" />
					<div class="flex justify-between text-[10px] text-zinc-500">
						<span>{disk.dev} · {disk.fstype}</span>
						<span
							>R {formatBytes(disk.io_read[disk.io_read.length - 1] ?? 0)}/s · W {formatBytes(
								disk.io_write[disk.io_write.length - 1] ?? 0
							)}/s</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
