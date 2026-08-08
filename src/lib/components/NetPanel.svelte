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

<div class="flex h-full flex-col gap-3 overflow-y-auto">
	{#if ifaces.length === 0}
		<div class="flex flex-1 items-center justify-center text-xs text-app-mute">no interfaces</div>
	{/if}
	{#each ifaces as { name, iface }, i (name)}
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<span
					class={`size-1.5 shrink-0 rounded-full ${iface.connected ? 'bg-net-dl' : 'bg-app-mute'}`}
				></span>
				<span class="text-sm font-semibold text-app-fg">{name}</span>
				{#if iface.ipv4}<span class="truncate text-xs text-app-mute">{iface.ipv4}</span>{/if}
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="rounded-xl border border-app-border bg-app-card2 px-3 py-2.5">
					<div
						class="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-net-dl uppercase"
					>
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
						</svg>
						down
					</div>
					<div class="mt-1.5 text-lg leading-none font-semibold text-app-fg tabular-nums">
						{formatSpeed(iface.download.speed)}
					</div>
					<div class="mt-1 text-[10px] text-app-mute tabular-nums">
						total {formatBytes(iface.download.total)}
					</div>
				</div>
				<div class="rounded-xl border border-app-border bg-app-card2 px-3 py-2.5">
					<div
						class="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-net-ul uppercase"
					>
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M12 21V9m0 0 4 4m-4-4-4 4M4 3h16" />
						</svg>
						up
					</div>
					<div class="mt-1.5 text-lg leading-none font-semibold text-app-fg tabular-nums">
						{formatSpeed(iface.upload.speed)}
					</div>
					<div class="mt-1 text-[10px] text-app-mute tabular-nums">
						total {formatBytes(iface.upload.total)}
					</div>
				</div>
			</div>
		</div>
		{#if i < ifaces.length - 1}
			<div class="h-px bg-app-border"></div>
		{/if}
	{/each}
</div>
