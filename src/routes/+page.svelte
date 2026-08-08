<script lang="ts">
	import { onMount } from 'svelte';
	import { dashboard } from '$lib/api/store.svelte';
	import Header from '$lib/components/Header.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import CpuPanel from '$lib/components/CpuPanel.svelte';
	import MemPanel from '$lib/components/MemPanel.svelte';
	import NetPanel from '$lib/components/NetPanel.svelte';
	import ProcPanel from '$lib/components/ProcPanel.svelte';
	import Panel from '$lib/components/Panel.svelte';

	onMount(() => {
		dashboard.start();
		return () => dashboard.stop();
	});

	const snapshot = $derived(dashboard.snapshot);
</script>

<svelte:head><title>btop · {snapshot?.meta.hostname ?? 'dashboard'}</title></svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 p-4">
	{#if snapshot}
		<Header meta={snapshot.meta} />
		<StatusBar />

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
			{#if snapshot.cpu}
				<div class="md:col-span-2">
					<Panel title="CPU" subtitle={snapshot.cpu.frequency}>
						<CpuPanel cpu={snapshot.cpu} />
					</Panel>
				</div>
			{/if}

			{#if snapshot.mem}
				<div>
					<Panel title="Memory" subtitle={`${snapshot.meta.cores} cores`}>
						<MemPanel mem={snapshot.mem} />
					</Panel>
				</div>
			{/if}

			{#if snapshot.net}
				<div>
					<Panel title="Network">
						<NetPanel net={snapshot.net} />
					</Panel>
				</div>
			{/if}

			{#if snapshot.proc}
				<div class="md:col-span-2 xl:col-span-4">
					<Panel title="Processes" subtitle={`${snapshot.proc.count} total`}>
						<ProcPanel proc={snapshot.proc} />
					</Panel>
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
			<div class="text-4xl font-bold text-zinc-700">btop</div>
			<p class="max-w-sm text-sm text-zinc-500">
				Waiting for the btop HTTP API on
				<code class="text-zinc-300">http://127.0.0.1:8080</code>. Start it with
				<code class="text-zinc-300">btop --http</code>
				or set <code class="text-zinc-300">VITE_BTOP_API_URL</code>.
			</p>
			{#if dashboard.error}
				<p class="text-xs text-rose-400">{dashboard.error}</p>
			{/if}
		</div>
	{/if}
</main>
