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
		dot: string;
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
				accent: 'metric-cpu',
				dot: 'bg-metric-cpu',
				value: formatPercent(cpuPct),
				show: !!snapshot?.cpu,
				col: 'col-span-12 row-span-2 md:col-span-8'
			},
			{
				key: 'mem',
				label: 'MEM',
				accent: 'metric-mem',
				dot: 'bg-metric-mem',
				value: formatPercent(memPct),
				show: !!snapshot?.mem,
				col: 'col-span-12 md:col-span-4'
			},
			{
				key: 'gpu',
				label: 'GPU',
				accent: 'metric-gpu',
				dot: 'bg-metric-gpu',
				value: hasGpu ? formatPercent(gpuPct) : '',
				show: hasGpu,
				col: 'col-span-12 md:col-span-4'
			},
			{
				key: 'net',
				label: 'NET',
				accent: 'metric-net',
				dot: 'bg-metric-net',
				value: snapshot?.net ? formatSpeed(netSpeed) : '',
				show: !!snapshot?.net,
				col: 'col-span-12 md:col-span-6'
			},
			{
				key: 'disk',
				label: 'DISK',
				accent: 'metric-disk',
				dot: 'bg-metric-disk',
				value: diskPct > 0 ? `${diskPct}%` : '',
				show: !!snapshot?.mem && snapshot.mem.disks.length > 0,
				col: 'col-span-12 md:col-span-6'
			},
			{
				key: 'proc',
				label: 'PROC',
				accent: 'metric-proc',
				dot: 'bg-metric-proc',
				value: snapshot?.proc ? String(procCount) : '',
				show: !!snapshot?.proc,
				col: 'col-span-12'
			}
		].filter((panel) => panel.show)
	);

	const tabs = $derived(
		panelConfigs.map(({ key, label, accent, value }) => ({ key, label, accent, value }))
	);
	const gridPanels = $derived(panelConfigs);

	let active = $state<PanelKey>('cpu');
	const activeKey = $derived(
		tabs.some((tab) => tab.key === active) ? active : (tabs[0]?.key ?? 'cpu')
	);
</script>

<svelte:head><title>btop · {snapshot?.meta.hostname ?? 'dashboard'}</title></svelte:head>

<main class="flex h-dvh min-h-0 flex-col bg-app-bg text-app-fg">
	<Header meta={snapshot?.meta} />

	{#if snapshot}
		{#snippet boxFor(key: PanelKey)}
			{#if key === 'cpu' && snapshot.cpu}
				<BtopBox title="CPU" accent="bg-metric-cpu">
					<CpuPanel cpu={snapshot.cpu} />
				</BtopBox>
			{:else if key === 'mem' && snapshot.mem}
				<BtopBox title="Memory" accent="bg-metric-mem">
					<MemPanel mem={snapshot.mem} />
				</BtopBox>
			{:else if key === 'gpu' && hasGpu}
				<BtopBox title="GPU" accent="bg-metric-gpu">
					<GpuPanel gpus={snapshot.gpu ?? []} />
				</BtopBox>
			{:else if key === 'net' && snapshot.net}
				<BtopBox title="Network" accent="bg-metric-net">
					<NetPanel net={snapshot.net} />
				</BtopBox>
			{:else if key === 'disk' && snapshot.mem && snapshot.mem.disks.length > 0}
				<BtopBox title="Storage" accent="bg-metric-disk">
					<DiskPanel disks={snapshot.mem.disks} />
				</BtopBox>
			{:else if key === 'proc' && snapshot.proc}
				<BtopBox title="Processes" accent="bg-metric-proc">
					{#snippet right()}
						<span class="rounded-full bg-app-card2 px-2 py-0.5 text-[10px] font-medium text-app-dim"
							>{snapshot.proc?.count}</span
						>
					{/snippet}
					<ProcPanel proc={snapshot.proc!} totalMem={memTotal} />
				</BtopBox>
			{/if}
		{/snippet}

		<div
			class="grid hidden min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1.6fr)] gap-3 p-3 md:grid"
		>
			{#each gridPanels as panel (panel.key)}
				<div class="min-h-0 {panel.col}">
					{@render boxFor(panel.key as PanelKey)}
				</div>
			{/each}
		</div>

		<div class="min-h-0 flex-1 p-3 md:hidden">
			{@render boxFor(activeKey as PanelKey)}
		</div>

		<TabBar items={tabs} active={activeKey} onselect={(key) => (active = key as PanelKey)} />
	{:else}
		<div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
			<div class="flex items-center gap-2">
				<span class="size-2 animate-pulse rounded-full bg-metric-cpu"></span>
				<span class="text-lg font-bold tracking-tight text-app-fg">btop</span>
			</div>
			{#if dashboard.error && dashboard.hosts.length > 1}
				<p class="max-w-md text-sm text-app-dim">
					This host is unreachable. Switch to another host in the header, or start
					<span class="font-medium text-app-fg">btop --http</span> on this host.
				</p>
			{:else}
				<p class="max-w-md text-sm text-app-dim">
					Waiting for the btop HTTP API.
					<br />
					Start it with <span class="font-medium text-app-fg">btop --http</span> or set
					<span class="font-medium text-app-fg">VITE_BTOP_API_URL</span> to one or more comma-separated
					URLs.
				</p>
			{/if}
			{#if dashboard.error}
				<p class="text-xs text-proc-high">{dashboard.error}</p>
			{/if}
		</div>
	{/if}
</main>
