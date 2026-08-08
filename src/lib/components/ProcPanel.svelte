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

<div class="flex h-full flex-col gap-2.5">
	<div class="flex shrink-0 items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<input
				type="search"
				placeholder="Filter processes…"
				class="h-8 w-40 rounded-lg border border-app-border bg-app-card2 px-3 text-xs text-app-fg outline-none placeholder:text-app-mute focus:border-metric-proc"
				bind:value={query}
			/>
			<button
				class="h-8 rounded-lg border border-app-border px-2.5 text-xs font-medium transition-colors {tree
					? 'border-metric-proc bg-metric-proc/10 text-metric-proc'
					: 'text-app-dim hover:text-app-fg'}"
				onclick={() => (tree = !tree)}>tree</button
			>
		</div>
		<span class="text-xs text-app-mute"
			>cpu <span class="font-semibold text-app-fg tabular-nums">{formatPercent(totalCpu)}</span
			></span
		>
	</div>

	<div class="min-h-0 flex-1 overflow-auto rounded-xl border border-app-border">
		<table class="w-full border-collapse text-xs">
			<thead class="sticky top-0 z-10 bg-app-card text-app-mute">
				<tr class="border-b border-app-border">
					{#each headers as header (header.label)}
						<th
							class="cursor-pointer px-3 py-2 text-[10px] font-medium tracking-wide uppercase transition-colors select-none hover:text-app-fg {header.align} {header.key ===
							'name'
								? 'w-full'
								: ''}"
							onclick={() => toggleSort(header.key)}
						>
							{header.label}
							{#if sortKey === header.key}
								<span class="text-metric-proc">{sortDir === 'asc' ? '↑' : '↓'}</span>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each visible as entry (entry.pid)}
					<tr
						class="border-b border-app-border/60 transition-colors hover:bg-app-card2"
						title={entry.cmd}
					>
						<td class="px-3 py-1 text-right text-app-mute tabular-nums">{entry.pid}</td>
						<td class="max-w-24 truncate px-3 py-1 text-app-fg">{entry.user}</td>
						<td class="px-3 py-1 text-right text-app-fg tabular-nums">{entry.nice}</td>
						<td class="px-3 py-1 text-center text-app-fg">{entry.state}</td>
						<td
							class="px-3 py-1 text-right font-semibold tabular-nums"
							style:color={gradientStop(entry.cpu_percent, '#34d399', '#f5b455', '#f43f5e')}
							>{entry.cpu_percent.toFixed(1)}</td
						>
						<td
							class="px-3 py-1 text-right tabular-nums"
							style:color={gradientStop(
								memPct(entry) > 0 ? Math.min(memPct(entry) * 5, 100) : 0,
								'#34d399',
								'#f5b455',
								'#f43f5e'
							)}>{totalMem > 0 ? memPct(entry).toFixed(1) : formatBytes(entry.mem)}</td
						>
						<td class="px-3 py-1 text-right text-app-fg tabular-nums"
							>{formatJiffies(entry.cpu_time)}</td
						>
						<td
							class="px-3 py-1 text-app-fg"
							style:padding-left={`${Math.min(entry.depth, 10) * 1.2 + 0.75}rem`}
						>
							{entry.name}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
