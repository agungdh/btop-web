<script lang="ts">
	import type { Disk } from '$lib/api/types';
	import { formatBytes, formatPercent, last } from '$lib/api/format';
	import Meter from './Meter.svelte';

	let { disks }: { disks: Disk[] } = $props();
</script>

<div class="flex h-full flex-col gap-1.5 overflow-y-auto">
	{#if disks.length === 0}
		<div class="flex flex-1 items-center justify-center text-[10px] text-btop-dim">no disks</div>
	{/if}
	{#each disks as disk, i (disk.dev)}
		<div class="flex flex-col gap-0.5">
			<div class="flex items-baseline justify-between gap-2 font-mono text-[10px]">
				<span class="truncate text-btop-title">{disk.name || disk.dev}</span>
				<span class="shrink-0 text-btop-dim"
					>{formatBytes(disk.used)}/{formatBytes(disk.total)} ({formatPercent(
						disk.used_percent
					)})</span
				>
			</div>
			<Meter
				value={disk.used_percent}
				start="#592b26"
				mid="#d9626d"
				end="#ff4769"
				height={7}
				valueText=""
			/>
			<div class="flex justify-between font-mono text-[9px] text-btop-dim">
				<span>{disk.dev}</span>
				<span>
					<span style:color="#4f43a3">R {formatBytes(last(disk.io_read))}/s</span>
					<span class="mx-0.5">·</span>
					<span style:color="#7d4180">W {formatBytes(last(disk.io_write))}/s</span>
				</span>
			</div>
		</div>
		{#if i < disks.length - 1}
			<div class="border-t border-btop-line"></div>
		{/if}
	{/each}
</div>
