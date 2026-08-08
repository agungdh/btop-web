<script lang="ts">
	import { clamp } from '$lib/api/format';

	let {
		value,
		color = 'bg-teal-500',
		height = 'h-1.5',
		track = 'bg-zinc-800'
	} = $props<{
		value: number;
		color?: string;
		height?: string;
		track?: string;
	}>();

	const width = $derived(`${clamp(value, 0, 100)}%`);
</script>

<div class={`w-full overflow-hidden rounded-full ${track} ${height}`}>
	<div class={`rounded-full ${height} ${color}`} style:width></div>
</div>
