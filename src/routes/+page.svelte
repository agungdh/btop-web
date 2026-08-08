<script lang="ts">
	import { onMount } from 'svelte';
	import { dashboard } from '$lib/api/store.svelte';
	import Header from '$lib/components/Header.svelte';
	import BtopBox from '$lib/components/BtopBox.svelte';
	import CpuPanel from '$lib/components/CpuPanel.svelte';
	import MemPanel from '$lib/components/MemPanel.svelte';
	import GpuPanel from '$lib/components/GpuPanel.svelte';
	import NetPanel from '$lib/components/NetPanel.svelte';
	import DiskPanel from '$lib/components/DiskPanel.svelte';
	import ProcPanel from '$lib/components/ProcPanel.svelte';

	onMount(() => {
		dashboard.start();
		return () => dashboard.stop();
	});

	const snapshot = $derived(dashboard.snapshot);
	const totalMem = $derived(
		snapshot?.mem
			? snapshot.mem.stats.used + snapshot.mem.stats.free + snapshot.mem.stats.cached
			: 0
	);
	const hasGpu = $derived(!!snapshot?.gpu && snapshot.gpu.length > 0);
</script>

<svelte:head><title>btop · {snapshot?.meta.hostname ?? 'dashboard'}</title></svelte:head>

<main class="flex h-dvh min-h-0 flex-col p-1 font-mono">
	{#if snapshot}
		<Header meta={snapshot.meta} />

		<div
			class="grid min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1.15fr)_minmax(0,0.8fr)_minmax(0,1.5fr)] gap-1"
		>
			{#if snapshot.cpu}
				<div class="col-span-12 min-h-0 lg:col-span-8">
					<BtopBox title="CPU" color="text-btop-cpu">
						<CpuPanel cpu={snapshot.cpu} />
					</BtopBox>
				</div>
			{/if}

			{#if snapshot.mem}
				<div class="col-span-12 min-h-0 lg:col-span-4">
					<BtopBox title="MEM" color="text-btop-mem">
						<MemPanel mem={snapshot.mem} />
					</BtopBox>
				</div>
			{/if}

			{#if hasGpu}
				<div class="col-span-12 min-h-0 md:col-span-4">
					<BtopBox title="GPU" color="text-btop-gpu">
						<GpuPanel gpus={snapshot.gpu ?? []} />
					</BtopBox>
				</div>
			{/if}

			{#if snapshot.net}
				<div class="col-span-12 min-h-0 md:col-span-4">
					<BtopBox title="NET" color="text-btop-net">
						<NetPanel net={snapshot.net} />
					</BtopBox>
				</div>
			{/if}

			{#if snapshot.mem && snapshot.mem.disks.length}
				<div class="col-span-12 min-h-0 md:col-span-4">
					<BtopBox title="DISK" color="text-btop-disk">
						<DiskPanel disks={snapshot.mem.disks} />
					</BtopBox>
				</div>
			{/if}

			{#if snapshot.proc}
				<div class="col-span-12 min-h-0">
					<BtopBox title="PROC" color="text-btop-proc">
						{#snippet right()}<span>{snapshot.proc?.count}</span>{/snippet}
						<ProcPanel proc={snapshot.proc!} {totalMem} />
					</BtopBox>
				</div>
			{/if}
		</div>
	{:else}
		<div
			class="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center font-mono"
		>
			<div class="text-2xl font-bold text-btop-cpu">btop</div>
			<p class="max-w-md text-[11px] text-btop-dim">
				waiting for the btop http api on <span class="text-btop-title">127.0.0.1:8080</span>.
				<br />
				start it with <span class="text-btop-title">btop --http</span> or set
				<span class="text-btop-title">VITE_BTOP_API_URL</span>.
			</p>
			{#if dashboard.error}
				<p class="text-[11px] text-btop-proc-high">{dashboard.error}</p>
			{/if}
		</div>
	{/if}
</main>
