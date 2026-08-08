<script lang="ts">
	import type { ProcEntry, ProcSection } from '$lib/api/types';
	import { formatBytes, formatJiffies, formatPercent, gradientStop } from '$lib/api/format';

	let { proc, totalMem }: { proc: ProcSection; totalMem: number } = $props();

	type SortKey = 'pid' | 'name' | 'user' | 'nice' | 'state' | 'cpu_percent' | 'mem' | 'cpu_time';

	const headers: { key: SortKey; label: string; align: string }[] = [
		{ key: 'pid', label: 'PID', align: 'text-right' },
		{ key: 'name', label: 'USER', align: 'text-left' },
		{ key: 'nice', label: 'NICE', align: 'text-right' },
		{ key: 'state', label: 'STATE', align: 'text-center' },
		{ key: 'cpu_percent', label: 'CPU%', align: 'text-right' },
		{ key: 'mem', label: 'MEM%', align: 'text-right' },
		{ key: 'cpu_time', label: 'TIME+', align: 'text-right' },
		{ key: 'name', label: 'COMMAND', align: 'text-left' }
	];

	let query = $state('');
	let sortKey = $state<SortKey>('cpu_percent');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let tree = $state(false);

	const memPct = $derived((entry: ProcEntry) => (totalMem > 0 ? (entry.mem / totalMem) * 100 : 0));

	const rows = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const base = q
			? proc.list.filter(
					(p) =>
						p.name.toLowerCase().includes(q) ||
						p.cmd.toLowerCase().includes(q) ||
						p.user.toLowerCase().includes(q)
				)
			: proc.list;
		if (tree) return base;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...base].sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv)) * dir;
		});
	});

	const totalCpu = $derived(proc.list.reduce((sum, p) => sum + p.cpu_percent, 0));
	const visible = $derived(rows.slice(0, 500));

	function toggleSort(key: SortKey): void {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'desc';
		}
	}
</script>

<div class="flex h-full flex-col gap-1">
	<div class="flex shrink-0 items-center justify-between gap-2 font-mono text-[10px]">
		<div class="flex items-center gap-2">
			<input
				type="search"
				placeholder="filter"
				class="w-28 rounded-none border border-btop-line bg-btop-meter/50 px-1.5 py-0.5 text-btop-fg outline-none placeholder:text-btop-dim focus:border-btop-cpu"
				bind:value={query}
			/>
			<button
				class="rounded-none border border-btop-line px-1.5 py-0.5 text-btop-dim transition-colors hover:text-btop-title {tree
					? 'border-btop-cpu text-btop-title'
					: ''}"
				onclick={() => (tree = !tree)}>tree</button
			>
		</div>
		<span class="text-btop-dim">cpu {formatPercent(totalCpu)}</span>
	</div>

	<div class="min-h-0 flex-1 overflow-auto border border-btop-line">
		<table class="w-full border-collapse font-mono text-[10px]">
			<thead class="sticky top-0 z-10 bg-btop-bg text-btop-dim">
				<tr class="border-b border-btop-line">
					{#each headers as header (header.label)}
						<th
							class="cursor-pointer px-1.5 py-0.5 font-normal uppercase transition-colors select-none hover:text-btop-title {header.align} {header.key ===
							'name'
								? 'w-full'
								: ''}"
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
					<tr
						class="border-b border-btop-line/60 hover:bg-btop-meter/30"
						title={entry.cmd}
						style:color={gradientStop(entry.cpu_percent, '#80d0a3', '#dcd179', '#d45454')}
					>
						<td class="px-1.5 py-[1px] text-right text-btop-dim">{entry.pid}</td>
						<td class="max-w-24 truncate px-1.5 py-[1px]">{entry.user}</td>
						<td class="px-1.5 py-[1px] text-right">{entry.nice}</td>
						<td class="px-1.5 py-[1px] text-center">{entry.state}</td>
						<td class="px-1.5 py-[1px] text-right">{entry.cpu_percent.toFixed(1)}</td>
						<td class="px-1.5 py-[1px] text-right"
							>{totalMem > 0 ? memPct(entry).toFixed(1) : formatBytes(entry.mem)}</td
						>
						<td class="px-1.5 py-[1px] text-right">{formatJiffies(entry.cpu_time)}</td>
						<td
							class="px-1.5 py-[1px]"
							style:padding-left={`${Math.min(entry.depth, 10) * 0.6 + 0.375}rem`}
						>
							{entry.name}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
