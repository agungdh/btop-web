<script module lang="ts">
	function cpuColor(pct: number): string {
		const hue = Math.max(0, 140 - pct * 1.4);
		return `hsl(${hue} 70% 55%)`;
	}
</script>

<script lang="ts">
	import type { ProcSection } from '$lib/api/types';
	import { formatBytes, formatPercent } from '$lib/api/format';

	let { proc }: { proc: ProcSection } = $props();

	type SortKey = 'pid' | 'name' | 'cpu_percent' | 'mem' | 'state' | 'threads';

	const headers: { key: SortKey; label: string; align: string }[] = [
		{ key: 'pid', label: 'PID', align: 'text-right' },
		{ key: 'name', label: 'Name', align: 'text-left' },
		{ key: 'cpu_percent', label: 'CPU%', align: 'text-right' },
		{ key: 'mem', label: 'Mem', align: 'text-right' },
		{ key: 'state', label: 'St', align: 'text-center' },
		{ key: 'threads', label: 'Thr', align: 'text-right' }
	];

	let query = $state('');
	let sortKey = $state<SortKey>('cpu_percent');
	let sortDir = $state<'asc' | 'desc'>('desc');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const rows = q
			? proc.list.filter(
					(p) =>
						p.name.toLowerCase().includes(q) ||
						p.cmd.toLowerCase().includes(q) ||
						p.user.toLowerCase().includes(q)
				)
			: proc.list;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv)) * dir;
		});
	});

	const visible = $derived(filtered.slice(0, 100));
	const totalCpu = $derived(proc.list.reduce((sum, p) => sum + p.cpu_percent, 0));

	function toggleSort(key: SortKey): void {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'desc';
		}
	}

	function stateColor(state: string): string {
		switch (state) {
			case 'R':
				return 'bg-emerald-500/20 text-emerald-300';
			case 'S':
				return 'bg-sky-500/20 text-sky-300';
			case 'Z':
				return 'bg-rose-500/20 text-rose-300';
			case 'D':
				return 'bg-amber-500/20 text-amber-300';
			default:
				return 'bg-zinc-700/30 text-zinc-400';
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between gap-2">
		<input
			type="search"
			placeholder="Filter processes…"
			class="w-full max-w-56 rounded border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-teal-500/60"
			bind:value={query}
		/>
		<span class="shrink-0 text-[10px] text-zinc-500"
			>{filtered.length} / {proc.count} shown · total CPU {formatPercent(totalCpu)}</span
		>
	</div>

	<div class="max-h-96 overflow-auto rounded border border-zinc-800">
		<table class="w-full border-collapse text-[11px]">
			<thead class="sticky top-0 z-10 bg-zinc-900 text-left">
				<tr>
					{#each headers as header (header.key)}
						<th
							class={`cursor-pointer border-b border-zinc-800 px-2 py-1 font-medium text-zinc-500 select-none hover:text-zinc-300 ${header.align}`}
							onclick={() => toggleSort(header.key)}
						>
							{header.label}
							{#if sortKey === header.key}{sortDir === 'asc' ? '↑' : '↓'}{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each visible as entry (entry.pid)}
					<tr class="border-b border-zinc-800/50 hover:bg-zinc-800/40" title={entry.cmd}>
						<td class="px-2 py-0.5 text-right font-mono text-zinc-400">{entry.pid}</td>
						<td
							class="max-w-56 truncate px-2 py-0.5 text-zinc-200"
							style:padding-left={`${Math.min(entry.depth, 8) * 0.5}rem`}
						>
							{entry.name}
						</td>
						<td
							class="px-2 py-0.5 text-right font-mono text-zinc-300"
							style:color={cpuColor(entry.cpu_percent)}>{entry.cpu_percent.toFixed(1)}</td
						>
						<td class="px-2 py-0.5 text-right font-mono text-zinc-400">{formatBytes(entry.mem)}</td>
						<td class="px-2 py-0.5 text-center">
							<span
								class={`inline-block min-w-4 rounded px-1 text-center text-[9px] font-bold ${stateColor(entry.state)}`}
								>{entry.state}</span
							>
						</td>
						<td class="px-2 py-0.5 text-right font-mono text-zinc-500">{entry.threads}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
