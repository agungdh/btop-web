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

<div class="flex h-full flex-col gap-2.5">
	<div class="flex items-center gap-5">
		<div class="shrink-0">
			<div class="text-[11px] font-medium text-app-dim">Total load</div>
			<div class="text-2xl font-semibold tracking-tight text-app-fg tabular-nums">
				{formatPercent(totalPct)}
			</div>
		</div>
		<div class="min-h-0 flex-1">
			<Chart values={total} max={100} height={56} color="#5b8cff" />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
		<div class="rounded-xl border border-app-border bg-app-card2 px-2.5 py-1.5">
			<div class="text-[10px] font-medium tracking-wide text-app-mute uppercase">Freq</div>
			<div class="mt-0.5 truncate text-[13px] font-semibold text-app-fg tabular-nums">
				{cpu.frequency}
			</div>
		</div>
		<div class="rounded-xl border border-app-border bg-app-card2 px-2.5 py-1.5">
			<div class="text-[10px] font-medium tracking-wide text-app-mute uppercase">Load</div>
			<div class="mt-0.5 truncate text-[13px] font-semibold text-app-fg tabular-nums">
				{cpu.load_avg.map((v: number) => v.toFixed(2)).join(' ')}
			</div>
		</div>
		{#if temp > 0}
			<div class="rounded-xl border border-app-border bg-app-card2 px-2.5 py-1.5">
				<div class="text-[10px] font-medium tracking-wide text-app-mute uppercase">Temp</div>
				<div class="mt-0.5 truncate text-[13px] font-semibold text-app-fg tabular-nums">
					{formatTemp(temp)}{cpu.temp_max > 0 ? ` / ${formatTemp(cpu.temp_max)}` : ''}
				</div>
			</div>
		{/if}
		{#if cpu.usage_watts > 0}
			<div class="rounded-xl border border-app-border bg-app-card2 px-2.5 py-1.5">
				<div class="text-[10px] font-medium tracking-wide text-app-mute uppercase">Power</div>
				<div class="mt-0.5 truncate text-[13px] font-semibold text-app-fg tabular-nums">
					{cpu.usage_watts.toFixed(1)} W
				</div>
			</div>
		{/if}
		{#if cpu.battery.charge > 0 || cpu.battery.status}
			<div class="rounded-xl border border-app-border bg-app-card2 px-2.5 py-1.5">
				<div class="text-[10px] font-medium tracking-wide text-app-mute uppercase">Battery</div>
				<div class="mt-0.5 truncate text-[13px] font-semibold text-app-fg tabular-nums">
					{cpu.battery.status} · {cpu.battery.charge}%
					{cpu.battery.time_left > 0
						? ` · ${Math.floor(cpu.battery.time_left / 3600)}h ${Math.floor((cpu.battery.time_left % 3600) / 60)}m`
						: ''}
				</div>
			</div>
		{/if}
	</div>

	<div class="min-h-0 flex-1">
		<div class="mb-1.5 text-[11px] font-medium text-app-dim">Cores ({cores.length})</div>
		<div class="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
			{#each cores as pct, i (i)}
				<div class="flex items-center gap-2">
					<span class="w-6 shrink-0 text-[10px] text-app-mute tabular-nums">C{i}</span>
					<div class="h-1 flex-1 overflow-hidden rounded-full bg-app-card2">
						<div
							class="h-full rounded-full transition-[width] duration-300"
							style:width={`${pct}%`}
							style:background-color={gradientStop(pct, '#34d399', '#f5b455', '#f43f5e')}
							title={`Core ${i}: ${formatPercent(pct)}`}
						></div>
					</div>
					<span class="w-8 shrink-0 text-right text-[10px] text-app-dim tabular-nums"
						>{formatPercent(pct)}</span
					>
				</div>
			{/each}
		</div>
	</div>
</div>
