<script lang="ts">
	import type { GpuSection } from '$lib/api/types';
	import {
		formatBytes,
		formatMilliwatts,
		formatPercent,
		formatTemp,
		gradientStop
	} from '$lib/api/format';
	import Meter from './Meter.svelte';

	let { gpus }: { gpus: GpuSection[] } = $props();
</script>

<div class="flex h-full flex-col gap-2.5">
	{#if gpus.length === 0}
		<div class="flex flex-1 items-center justify-center text-xs text-app-mute">no gpu</div>
	{/if}
	{#each gpus as gpu, i (i)}
		<div class="flex flex-col gap-2">
			<div class="truncate text-sm font-semibold text-app-fg">{gpu.name}</div>

			<div class="flex items-center gap-3">
				<div
					class="w-14 shrink-0 text-right text-xl leading-none font-semibold text-app-fg tabular-nums"
				>
					{formatPercent(gpu.utilization)}
				</div>
				<div class="min-w-0 flex-1">
					<div class="h-1.5 overflow-hidden rounded-full bg-app-card2">
						<div
							class="h-full rounded-full transition-[width] duration-500"
							style:width={`${gpu.utilization}%`}
							style:background-color={gradientStop(
								gpu.utilization,
								'#34d399',
								'#f5b455',
								'#f43f5e'
							)}
						></div>
					</div>
				</div>
			</div>

			{#if gpu.vram_total > 0}
				<Meter
					value={(gpu.vram_used / gpu.vram_total) * 100}
					label="vram"
					start="#38bdf8"
					mid="#38bdf8"
					end="#38bdf8"
					height={5}
					valueText={`${formatBytes(gpu.vram_used)} / ${formatBytes(gpu.vram_total)}`}
				/>
			{/if}

			<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:grid-cols-4">
				{#if gpu.temp > 0}
					<div class="flex justify-between">
						<span class="text-app-mute">Temp</span>
						<span class="font-medium text-app-fg tabular-nums">{formatTemp(gpu.temp)}</span>
					</div>
				{/if}
				{#if gpu.power_mw > 0}
					<div class="flex justify-between">
						<span class="text-app-mute">Power</span>
						<span class="font-medium text-app-fg tabular-nums"
							>{formatMilliwatts(gpu.power_mw)}{gpu.power_max_mw > 0
								? ` / ${formatMilliwatts(gpu.power_max_mw)}`
								: ''}</span
						>
					</div>
				{/if}
				{#if (gpu.gpu_clock_mhz ?? gpu.clock_mhz ?? 0) > 0}
					<div class="flex justify-between">
						<span class="text-app-mute">Clock</span>
						<span class="font-medium text-app-fg tabular-nums"
							>{gpu.gpu_clock_mhz ?? gpu.clock_mhz} MHz</span
						>
					</div>
				{/if}
				{#if gpu.mem_clock_mhz > 0}
					<div class="flex justify-between">
						<span class="text-app-mute">Mem clk</span>
						<span class="font-medium text-app-fg tabular-nums">{gpu.mem_clock_mhz} MHz</span>
					</div>
				{/if}
			</div>
		</div>
		{#if i < gpus.length - 1}
			<div class="h-px bg-app-border"></div>
		{/if}
	{/each}
</div>
