<script lang="ts">
	import type { NetSection } from '$lib/api/types';
	import { formatBytes, formatSpeed } from '$lib/api/format';

	let { net }: { net: NetSection } = $props();

	const ifaces = $derived(
		net.interfaces
			.map((name: string) => ({ name, iface: net.current[name] }))
			.filter((entry) => entry.iface !== undefined)
	);
</script>

<div class="flex flex-col gap-2">
	{#if ifaces.length === 0}
		<div class="py-6 text-center text-[11px] text-zinc-600">No network interfaces</div>
	{/if}
	{#each ifaces as { name, iface } (name)}
		<div class="flex flex-col gap-1 rounded border border-zinc-800 bg-zinc-950/50 p-2">
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span
						class="inline-block size-1.5 rounded-full {iface.connected
							? 'bg-emerald-500'
							: 'bg-zinc-600'}"
					></span>
					<span class="text-xs font-semibold text-zinc-200">{name}</span>
					{#if iface.ipv4}<span class="font-mono text-[10px] text-zinc-500">{iface.ipv4}</span>{/if}
					{#if iface.ipv6}<span class="hidden font-mono text-[10px] text-zinc-600 md:inline"
							>{iface.ipv6}</span
						>{/if}
				</div>
			</div>
			<div class="grid grid-cols-2 gap-2 pt-1">
				<div class="flex flex-col rounded bg-zinc-900/70 p-1.5">
					<span class="text-[9px] tracking-wider text-zinc-600 uppercase">Download</span>
					<span class="font-mono text-sm text-emerald-400">{formatSpeed(iface.download.speed)}</span
					>
					<span class="font-mono text-[10px] text-zinc-500"
						>total {formatBytes(iface.download.total)}</span
					>
				</div>
				<div class="flex flex-col rounded bg-zinc-900/70 p-1.5">
					<span class="text-[9px] tracking-wider text-zinc-600 uppercase">Upload</span>
					<span class="font-mono text-sm text-rose-400">{formatSpeed(iface.upload.speed)}</span>
					<span class="font-mono text-[10px] text-zinc-500"
						>total {formatBytes(iface.upload.total)}</span
					>
				</div>
			</div>
		</div>
	{/each}
</div>
