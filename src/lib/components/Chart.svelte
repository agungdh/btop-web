<script lang="ts">
	let {
		values,
		max = 100,
		min = 0,
		height = 56,
		color = '#2dd4bf',
		fill = true,
		strokeWidth = 1.5
	}: {
		values: number[];
		max?: number;
		min?: number;
		height?: number;
		color?: string;
		fill?: boolean;
		strokeWidth?: number;
	} = $props();

	const gradientId = `chart-${Math.random().toString(36).slice(2, 10)}`;

	const viewWidth = 600;

	function clampValue(value: number): number {
		return Math.min(Math.max(value, min), max);
	}

	const points = $derived.by(() => {
		if (values.length === 0) return '';
		const span = Math.max(max - min, 0.0001);
		const last = values.length - 1 || 1;
		return values
			.map((value, i) => {
				const x = (i / last) * viewWidth;
				const y = height - ((clampValue(value) - min) / span) * height;
				return `${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');
	});

	const area = $derived(points === '' ? '' : `${points} ${viewWidth},${height} 0,${height}`);
</script>

<svg
	viewBox={`0 0 ${viewWidth} ${height}`}
	preserveAspectRatio="none"
	class="block h-full w-full"
	role="img"
	aria-label="history chart"
>
	<defs>
		<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.35" />
			<stop offset="100%" stop-color={color} stop-opacity="0" />
		</linearGradient>
	</defs>
	{#if area && fill}
		<polygon points={area} fill={`url(#${gradientId})`} />
	{/if}
	{#if points}
		<polyline
			{points}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linejoin="round"
			stroke-linecap="round"
			vector-effect="non-scaling-stroke"
		/>
	{/if}
</svg>
