<script lang="ts">
	import type { CpuSection } from '$lib/api/types';
	import { formatPercent, formatTemp } from '$lib/api/format';
	import Chart from './Chart.svelte';
	import Gauge from './Gauge.svelte';

	let { cpu }: { cpu: CpuSection } = $props();

	const total = $derived(cpu.percent.total ?? []);
	const totalPct = $derived(total.length ? total[total.length - 1] : 0);
	const coreStrip = $derived(
		cpu.core_percent.map((core: number[]) => (core.length ? core[core.length - 1] : 0))
	);
	const temp = $derived(
		cpu.temp.length ? Math.max(...cpu.temp.map((core: number[]) => core[core.length - 1] ?? 0)) : 0
	);

	function barColor(pct: number): string {
		const hue = Math.max(0, 140 - pct * 1.4);
		return `hsl(${hue} 70% 50%)`;
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-4">
		<Gauge value={totalPct} label="CPU" sublabel={formatPercent(totalPct)} color="#2dd4bf" />
		<div class="h-16 min-w-0 flex-1">
			<Chart values={total} max={100} color="#2dd4bf" />
		</div>
	</div>

	{#if coreStrip.length}
		<div
			class="flex h-10 items-end gap-[3px]"
			title={coreStrip.map((pct, i) => `Core ${i}: ${formatPercent(pct)}`).join('\n')}
		>
			{#each coreStrip as pct, i (i)}
				<div
					class="flex-1 rounded-sm transition-[height] duration-500"
					style:height={`${Math.max(pct, 2)}%`}
					style:background-color={barColor(pct)}
					title={`Core ${i}: ${formatPercent(pct)}`}
				></div>
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:grid-cols-3">
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Freq</span>
			<span class="font-mono text-zinc-200">{cpu.frequency}</span>
		</div>
		<div class="flex justify-between gap-2">
			<span class="text-zinc-500">Load avg</span>
			<span class="font-mono text-zinc-200"
				>{cpu.load_avg.map((v: number) => v.toFixed(2)).join(' ')}</span
			>
		</div>
		{#if temp > 0}
			<div class="flex justify-between gap-2">
				<span class="text-zinc-500">Temp</span>
				<span class="font-mono text-zinc-200"
					>{formatTemp(temp)}{cpu.temp_max > 0 ? ` / ${formatTemp(cpu.temp_max)}` : ''}</span
				>
			</div>
		{/if}
		{#if cpu.usage_watts > 0}
			<div class="flex justify-between gap-2">
				<span class="text-zinc-500">Power</span>
				<span class="font-mono text-zinc-200">{cpu.usage_watts.toFixed(1)} W</span>
			</div>
		{/if}
		{#if cpu.battery.charge >= 0}
			<div class="flex justify-between gap-2">
				<span class="text-zinc-500">Battery</span>
				<span class="font-mono text-zinc-200">{cpu.battery.status} {cpu.battery.charge}%</span>
			</div>
		{/if}
	</div>
</div>
