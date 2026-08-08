<script lang="ts">
	import type { Meta } from '$lib/api/types';
	import { formatUptime } from '$lib/api/format';

	let { meta }: { meta: Meta } = $props();
</script>

<header class="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800 pb-3">
	<div>
		<h1 class="text-lg font-bold tracking-tight text-zinc-100">
			<span class="text-teal-400">btop</span>
			<span class="ml-2 text-sm font-normal text-zinc-400">@{meta.hostname}</span>
		</h1>
		<p class="text-[11px] text-zinc-500">
			{meta.cpu_name}
			<span class="text-zinc-600">·</span>
			{meta.cores} cores
		</p>
	</div>
	<div class="flex flex-col items-end gap-0.5 text-right text-[11px]">
		<div class="text-zinc-400">
			<span class="text-zinc-600">v</span>{meta.version}
			{#if meta.platform}<span class="text-zinc-600"> · {meta.platform}</span>{/if}
			{#if meta.kernel}<span class="text-zinc-600"> · {meta.kernel}</span>{/if}
		</div>
		<div class="font-mono text-zinc-500">up {formatUptime(meta.uptime)}</div>
	</div>
</header>
