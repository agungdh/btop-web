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

<div class="flex h-full flex-col gap-1.5 overflow-y-auto">
	{#if ifaces.length === 0}
		<div class="flex flex-1 items-center justify-center text-[10px] text-btop-dim">
			no interfaces
		</div>
	{/if}
	{#each ifaces as { name, iface }, i (name)}
		<div class="flex flex-col gap-0.5">
			<div class="flex items-center gap-1.5 font-mono text-[10px]">
				<span
					class="inline-block size-1 rounded-full {iface.connected
						? 'bg-btop-dl-bright'
						: 'bg-btop-meter'}"
				></span>
				<span class="text-btop-title">{name}</span>
				{#if iface.ipv4}<span class="truncate text-btop-dim">{iface.ipv4}</span>{/if}
			</div>
			<div class="grid grid-cols-2 gap-1.5 pt-0.5">
				<div class="flex flex-col border border-btop-line px-1.5 py-1">
					<span class="text-[9px] font-bold text-btop-dl-bright">DOWN</span>
					<span class="font-mono text-sm leading-tight text-btop-fg"
						>{formatSpeed(iface.download.speed)}</span
					>
					<span class="font-mono text-[9px] text-btop-dim"
						>total {formatBytes(iface.download.total)}</span
					>
				</div>
				<div class="flex flex-col border border-btop-line px-1.5 py-1">
					<span class="text-[9px] font-bold text-btop-ul-bright">UP</span>
					<span class="font-mono text-sm leading-tight text-btop-fg"
						>{formatSpeed(iface.upload.speed)}</span
					>
					<span class="font-mono text-[9px] text-btop-dim"
						>total {formatBytes(iface.upload.total)}</span
					>
				</div>
			</div>
		</div>
		{#if i < ifaces.length - 1}
			<div class="border-t border-btop-line"></div>
		{/if}
	{/each}
</div>
