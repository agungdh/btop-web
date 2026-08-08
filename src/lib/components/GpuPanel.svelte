<script lang="ts">
	import type { GpuSection } from '$lib/api/types';
	import { formatBytes, formatMilliwatts, formatPercent, formatTemp } from '$lib/api/format';
	import Meter from './Meter.svelte';

	let { gpus }: { gpus: GpuSection[] } = $props();
</script>

<div class="flex h-full flex-col gap-1.5 overflow-y-auto">
	{#if gpus.length === 0}
		<div class="flex flex-1 items-center justify-center text-[10px] text-btop-dim">no gpu</div>
	{/if}
	{#each gpus as gpu, i (i)}
		<div class="flex flex-col gap-0.5">
			<div class="truncate text-[10px] font-bold text-btop-title">{gpu.name}</div>
			<Meter
				value={gpu.utilization}
				label="util"
				start="#556d59"
				mid="#77ca9b"
				end="#dc4c4c"
				valueText={formatPercent(gpu.utilization)}
			/>
			{#if gpu.vram_total > 0}
				<Meter
					value={(gpu.vram_used / gpu.vram_total) * 100}
					label="vram"
					start="#163350"
					mid="#74e6fc"
					end="#26c5ff"
					valueText={`${formatBytes(gpu.vram_used)} / ${formatBytes(gpu.vram_total)}`}
				/>
			{/if}
			<div class="grid grid-cols-2 gap-x-3 font-mono text-[9px] text-btop-dim">
				{#if gpu.temp > 0}
					<div class="flex justify-between">
						<span class="text-btop-title">temp</span><span>{formatTemp(gpu.temp)}</span>
					</div>
				{/if}
				{#if gpu.power_mw > 0}
					<div class="flex justify-between">
						<span class="text-btop-title">pwr</span><span
							>{formatMilliwatts(gpu.power_mw)}{gpu.power_max_mw > 0
								? `/${formatMilliwatts(gpu.power_max_mw)}`
								: ''}</span
						>
					</div>
				{/if}
				{#if gpu.gpu_clock_mhz > 0}
					<div class="flex justify-between">
						<span class="text-btop-title">clk</span><span>{gpu.gpu_clock_mhz} MHz</span>
					</div>
				{/if}
				{#if gpu.mem_clock_mhz > 0}
					<div class="flex justify-between">
						<span class="text-btop-title">mclk</span><span>{gpu.mem_clock_mhz} MHz</span>
					</div>
				{/if}
			</div>
		</div>
		{#if i < gpus.length - 1}
			<div class="border-t border-btop-line"></div>
		{/if}
	{/each}
</div>
