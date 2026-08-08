<script lang="ts">
	import { clamp } from '$lib/api/format';

	let {
		value,
		size = 72,
		color = 'var(--color-metric-cpu)',
		label = '',
		sublabel = ''
	} = $props<{
		value: number;
		size?: number;
		color?: string;
		label?: string;
		sublabel?: string;
	}>();

	const radius = $derived((size - 8) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const clamped = $derived(clamp(value, 0, 100));
	const dashOffset = $derived(circumference * (1 - clamped / 100));
</script>

<div class="flex flex-col items-center gap-1">
	<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--color-app-card2)"
			stroke-width="6"
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width="6"
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={dashOffset}
			transform={`rotate(-90 ${size / 2} ${size / 2})`}
		/>
		<text
			x="50%"
			y="50%"
			text-anchor="middle"
			dominant-baseline="central"
			fill="var(--color-app-fg)"
			font-size={size / 3.6}
			font-weight="700"
		>
			{clamped.toFixed(0)}
		</text>
	</svg>
	{#if label}
		<div class="text-[10px] leading-none text-app-dim">{label}</div>
	{/if}
	{#if sublabel}
		<div class="text-[10px] leading-none text-app-mute">{sublabel}</div>
	{/if}
</div>
