<script lang="ts">
	import { clamp, gradientStop } from '$lib/api/format';

	let {
		value,
		label = '',
		valueText = '',
		start = '#34d399',
		mid = '#f5b455',
		end = '#f43f5e',
		height = 6
	}: {
		value: number;
		label?: string;
		valueText?: string;
		start?: string;
		mid?: string;
		end?: string;
		height?: number;
	} = $props();

	const pct = $derived(clamp(value, 0, 100));
	const color = $derived(gradientStop(pct, start, mid, end));
</script>

<div class="flex items-center gap-2.5">
	<span class="w-14 shrink-0 text-[11px] font-medium text-app-dim">{label}</span>
	<div
		class="min-w-0 flex-1 overflow-hidden rounded-full bg-app-card2"
		style:height={`${height}px`}
	>
		<div
			class="h-full rounded-full transition-[width] duration-500"
			style:width={`${pct}%`}
			style:background-color={color}
		></div>
	</div>
	<span class="shrink-0 text-[11px] text-app-dim tabular-nums">{valueText}</span>
</div>
