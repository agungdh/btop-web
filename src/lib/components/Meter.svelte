<script lang="ts">
	import { clamp, gradientStop } from '$lib/api/format';

	let {
		value,
		label = '',
		valueText = '',
		start = '#d9626d',
		mid = '#d9626d',
		end = '#d9626d',
		height = 9
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

<div class="flex items-center gap-1.5 font-mono text-[10px] leading-tight">
	<span class="w-16 shrink-0 text-btop-title">{label}</span>
	<div class="flex-1 overflow-hidden rounded-sm bg-btop-meter" style:height={`${height}px`}>
		<div
			class="h-full transition-[width] duration-300"
			style:width={`${pct}%`}
			style:background-color={color}
		></div>
	</div>
	<span class="w-24 shrink-0 text-right text-btop-dim">{valueText}</span>
</div>
