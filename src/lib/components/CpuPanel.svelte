<script lang="ts">
	import type { CpuSection } from '$lib/api/types';
	import { formatPercent, formatTemp, gradientStop, last } from '$lib/api/format';
	import Chart from './Chart.svelte';

	let { cpu }: { cpu: CpuSection } = $props();

	const total = $derived(cpu.percent.total ?? []);
	const totalPct = $derived(last(total));
	const cores = $derived(cpu.core_percent.map((core: number[]) => last(core)));
	const temp = $derived(
		cpu.temp.length ? Math.max(...cpu.temp.map((core: number[]) => last(core))) : 0
	);
</script>

<div class="flex h-full min-h-0 flex-col gap-1.5 overflow-y-auto">
	<div class="flex min-h-0 flex-1 gap-2">
		<div class="min-w-0 flex-1">
			<Chart values={total} max={100} height={96} color="#77ca9b" />
			<div class="mt-0.5 text-right text-[9px] text-btop-dim">{formatPercent(totalPct)}</div>
		</div>
		<div class="flex w-1/3 min-w-28 flex-col justify-center gap-[2px]">
			{#each cores as pct, i (i)}
				<div class="flex items-center gap-1 font-mono text-[9px]">
					<span class="w-3 shrink-0 text-right text-btop-dim">{i}</span>
					<div class="h-[8px] flex-1 overflow-hidden rounded-sm bg-btop-meter">
						<div
							class="h-full transition-[width] duration-300"
							style:width={`${pct}%`}
							style:background-color={gradientStop(pct, '#77ca9b', '#cbc06c', '#dc4c4c')}
							title={`Core ${i}: ${formatPercent(pct)}`}
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div
		class="grid grid-cols-2 gap-x-3 gap-y-0.5 border-t border-btop-line pt-1 font-mono text-[10px]"
	>
		<div class="flex justify-between">
			<span class="text-btop-title">Freq</span>
			<span class="text-btop-dim">{cpu.frequency}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-btop-title">Load</span>
			<span class="text-btop-dim">{cpu.load_avg.map((v: number) => v.toFixed(2)).join(' ')}</span>
		</div>
		{#if temp > 0}
			<div class="flex justify-between">
				<span class="text-btop-title">Temp</span>
				<span class="text-btop-dim"
					>{formatTemp(temp)}{cpu.temp_max > 0 ? `/${formatTemp(cpu.temp_max)}` : ''}</span
				>
			</div>
		{/if}
		{#if cpu.usage_watts > 0}
			<div class="flex justify-between">
				<span class="text-btop-title">Power</span>
				<span class="text-btop-dim">{cpu.usage_watts.toFixed(1)} W</span>
			</div>
		{/if}
		{#if cpu.battery.charge >= 0}
			<div class="col-span-2 flex justify-between">
				<span class="text-btop-title">Battery</span>
				<span class="text-btop-dim"
					>{cpu.battery.status}
					{cpu.battery.charge}%{cpu.battery.time_left > 0
						? ` (${Math.floor(cpu.battery.time_left / 3600)}h ${Math.floor((cpu.battery.time_left % 3600) / 60)}m)`
						: ''}</span
				>
			</div>
		{/if}
	</div>
</div>
