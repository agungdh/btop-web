<script lang="ts">
	import { onMount } from 'svelte';
	import { dashboard } from '$lib/api/store.svelte';
	import { formatPercent, formatSpeed, last } from '$lib/api/format';
	import Header from '$lib/components/Header.svelte';
	import BtopBox from '$lib/components/BtopBox.svelte';
	import CpuPanel from '$lib/components/CpuPanel.svelte';
	import MemPanel from '$lib/components/MemPanel.svelte';
	import GpuPanel from '$lib/components/GpuPanel.svelte';
	import NetPanel from '$lib/components/NetPanel.svelte';
	import DiskPanel from '$lib/components/DiskPanel.svelte';
	import ProcPanel from '$lib/components/ProcPanel.svelte';
	import TabBar, { type TabItem } from '$lib/components/TabBar.svelte';

	onMount(() => {
		dashboard.start();
		return () => dashboard.stop();
	});

	type PanelKey = 'cpu' | 'mem' | 'gpu' | 'net' | 'disk' | 'proc';

	interface PanelConfig extends TabItem {
		show: boolean;
		col: string;
	}

	const snapshot = $derived(dashboard.snapshot);
	const memTotal = $derived(
		snapshot?.mem
			? snapshot.mem.stats.used + snapshot.mem.stats.free + snapshot.mem.stats.cached
			: 0
	);
	const hasGpu = $derived(!!snapshot?.gpu && snapshot.gpu.length > 0);

	const cpuPct = $derived(snapshot?.cpu ? last(snapshot.cpu.percent.total ?? []) : 0);
	const memPct = $derived(
		snapshot?.mem && memTotal > 0 ? (snapshot.mem.stats.used / memTotal) * 100 : 0
	);
	const netSpeed = $derived(
		snapshot?.net
			? Object.values(snapshot.net.current).reduce(
					(sum, iface) => sum + iface.download.speed + iface.upload.speed,
					0
				)
			: 0
	);
	const diskPct = $derived(
		snapshot?.mem && snapshot.mem.disks.length
			? Math.round(
					snapshot.mem.disks.reduce((sum, disk) => sum + disk.used_percent, 0) /
						snapshot.mem.disks.length
				)
			: 0
	);
	const gpuPct = $derived(
		hasGpu ? Math.max(...(snapshot?.gpu ?? []).map((gpu) => gpu.utilization)) : 0
	);
	const procCount = $derived(snapshot?.proc?.count ?? 0);

	const panelConfigs = $derived<PanelConfig[]>(
		[
			{
				key: 'cpu',
				label: 'CPU',
				text: 'text-btop-cpu',
				bar: 'bg-btop-cpu',
				value: formatPercent(cpuPct),
				show: !!snapshot?.cpu,
				col: 'md:col-span-8'
			},
			{
				key: 'mem',
				label: 'MEM',
				text: 'text-btop-mem',
				bar: 'bg-btop-mem',
				value: formatPercent(memPct),
				show: !!snapshot?.mem,
				col: 'md:col-span-4'
			},
			{
				key: 'gpu',
				label: 'GPU',
				text: 'text-btop-gpu',
				bar: 'bg-btop-gpu',
				value: hasGpu ? formatPercent(gpuPct) : '',
				show: hasGpu,
				col: 'md:col-span-4'
			},
			{
				key: 'net',
				label: 'NET',
				text: 'text-btop-net',
				bar: 'bg-btop-net',
				value: snapshot?.net ? formatSpeed(netSpeed) : '',
				show: !!snapshot?.net,
				col: 'md:col-span-4'
			},
			{
				key: 'disk',
				label: 'DISK',
				text: 'text-btop-disk',
				bar: 'bg-btop-disk',
				value: diskPct > 0 ? `${diskPct}%` : '',
				show: !!snapshot?.mem && snapshot.mem.disks.length > 0,
				col: 'md:col-span-4'
			},
			{
				key: 'proc',
				label: 'PROC',
				text: 'text-btop-proc',
				bar: 'bg-btop-proc',
				value: snapshot?.proc ? String(procCount) : '',
				show: !!snapshot?.proc,
				col: 'md:col-span-12'
			}
		].filter((panel) => panel.show)
	);

	const tabs = $derived(
		panelConfigs.map(({ key, label, text, bar, value }) => ({ key, label, text, bar, value }))
	);
	const gridPanels = $derived(panelConfigs);

	let active = $state<PanelKey>('cpu');
	const activeKey = $derived(
		tabs.some((tab) => tab.key === active) ? active : (tabs[0]?.key ?? 'cpu')
	);
</script>

<svelte:head><title>btop · {snapshot?.meta.hostname ?? 'dashboard'}</title></svelte:head>

<main class="flex h-dvh min-h-0 flex-col p-1 font-mono">
	{#if snapshot}
		<Header meta={snapshot.meta} />

		{#snippet boxFor(key: PanelKey)}
			{#if key === 'cpu' && snapshot.cpu}
				<BtopBox title="CPU" color="text-btop-cpu">
					<CpuPanel cpu={snapshot.cpu} />
				</BtopBox>
			{:else if key === 'mem' && snapshot.mem}
				<BtopBox title="MEM" color="text-btop-mem">
					<MemPanel mem={snapshot.mem} />
				</BtopBox>
			{:else if key === 'gpu' && hasGpu}
				<BtopBox title="GPU" color="text-btop-gpu">
					<GpuPanel gpus={snapshot.gpu ?? []} />
				</BtopBox>
			{:else if key === 'net' && snapshot.net}
				<BtopBox title="NET" color="text-btop-net">
					<NetPanel net={snapshot.net} />
				</BtopBox>
			{:else if key === 'disk' && snapshot.mem && snapshot.mem.disks.length > 0}
				<BtopBox title="DISK" color="text-btop-disk">
					<DiskPanel disks={snapshot.mem.disks} />
				</BtopBox>
			{:else if key === 'proc' && snapshot.proc}
				<BtopBox title="PROC" color="text-btop-proc">
					{#snippet right()}<span>{snapshot.proc?.count}</span>{/snippet}
					<ProcPanel proc={snapshot.proc!} totalMem={memTotal} />
				</BtopBox>
			{/if}
		{/snippet}

		<div
			class="grid hidden min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1.15fr)_minmax(0,0.8fr)_minmax(0,1.5fr)] gap-1 md:grid"
		>
			{#each gridPanels as panel (panel.key)}
				<div class="min-h-0 {panel.col}">
					{@render boxFor(panel.key as PanelKey)}
				</div>
			{/each}
		</div>

		<div class="min-h-0 flex-1 md:hidden">
			{@render boxFor(activeKey as PanelKey)}
		</div>

		<TabBar items={tabs} active={activeKey} onselect={(key) => (active = key as PanelKey)} />
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
