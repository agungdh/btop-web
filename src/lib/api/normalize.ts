import type { MemStats } from './types';

//? btop exposes memory stats with platform-specific keys. Linux sends
//? used/free/cached/swap_* while Windows sends used/available/cached/page_*
//? plus an explicit total. These helpers map both to one view so the UI is
//? backend-agnostic.
export interface MemStatsView {
	used: number;
	available: number;
	cached: number;
	free: number;
	total: number;
	swap_total: number;
	swap_used: number;
}

export function normalizeMemStats(stats: Partial<MemStats>): MemStatsView {
	const used = stats.used ?? 0;
	const available = stats.available ?? 0;
	const cached = stats.cached ?? 0;
	//? Windows emits a `total` key that is always 0, so a non-zero value is
	//? required to trust it. Linux has no total at all (derive from free),
	//? and without a free field the closest Windows estimate is used+available.
	const freeValue = typeof stats.free === 'number' && stats.free >= 0 ? stats.free : undefined;
	const totalValue = typeof stats.total === 'number' && stats.total > 0 ? stats.total : undefined;

	const total =
		totalValue !== undefined
			? totalValue
			: freeValue !== undefined
				? used + freeValue + cached
				: used + available;
	const free = freeValue !== undefined ? freeValue : Math.max(total - used - cached, 0);
	return {
		used,
		available,
		cached,
		free,
		total,
		swap_total: stats.swap_total ?? stats.page_total ?? 0,
		swap_used: stats.swap_used ?? stats.page_used ?? 0
	};
}

//? Total physical memory in bytes for the given raw stats.
export function totalMemBytes(stats: Partial<MemStats>): number {
	return normalizeMemStats(stats).total;
}

//? Stable per-disk identity: Linux has `dev`, Windows only exposes `name`.
export function diskKey(disk: { dev?: string; name?: string }, index: number): string {
	return disk.dev ?? disk.name ?? `disk-${index}`;
}
