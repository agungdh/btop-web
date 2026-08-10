<script lang="ts">
	import type { Disk } from '$lib/api/types';
	import { formatBytes, formatPercent, last } from '$lib/api/format';
	import { diskKey } from '$lib/api/normalize';
	import Meter from './Meter.svelte';

	let { disks }: { disks: Disk[] } = $props();
</script>

<div class="flex h-full flex-col gap-3 overflow-y-auto">
	{#if disks.length === 0}
		<div class="flex flex-1 items-center justify-center text-xs text-app-mute">no disks</div>
	{/if}
	{#each disks as disk, i (diskKey(disk, i))}
		<div class="flex flex-col gap-1.5">
			<div class="flex items-baseline justify-between gap-2">
				<span class="truncate text-sm font-semibold text-app-fg">{disk.name || disk.dev}</span>
				<span class="shrink-0 text-xs text-app-dim tabular-nums"
					>{formatBytes(disk.used)} / {formatBytes(disk.total)} · {formatPercent(
						disk.used_percent
					)}</span
				>
			</div>
			<Meter
				value={disk.used_percent}
				start="#f5b455"
				mid="#f5b455"
				end="#f5b455"
				height={6}
				valueText=""
			/>
			<div class="flex justify-between text-[10px] text-app-mute tabular-nums">
				<span>{disk.dev ?? ''}</span>
				<span>
					<span style:color="#2dd4bf">↓ {formatBytes(last(disk.io_read))}/s</span>
					<span class="mx-1 text-app-mute">·</span>
					<span style:color="#c084fc">↑ {formatBytes(last(disk.io_write))}/s</span>
				</span>
			</div>
		</div>
		{#if i < disks.length - 1}
			<div class="h-px bg-app-border"></div>
		{/if}
	{/each}
</div>
