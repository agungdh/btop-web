import { describe, it, expect } from 'vitest';
import { diskKey, normalizeMemStats, totalMemBytes } from './normalize';

const LINUX = {
	used: 8,
	available: 8,
	cached: 2,
	free: 1,
	swap_total: 4,
	swap_used: 1,
	swap_free: 3
};

const WINDOWS = {
	used: 8,
	available: 10,
	cached: 2,
	total: 0,
	page_total: 4,
	page_used: 1,
	page_free: 3
};

describe('normalizeMemStats', () => {
	it('passes through Linux keys', () => {
		expect(normalizeMemStats(LINUX)).toEqual({
			used: 8,
			available: 8,
			cached: 2,
			free: 1,
			total: 11,
			swap_total: 4,
			swap_used: 1
		});
	});

	it('derives free and total from Windows keys', () => {
		expect(normalizeMemStats(WINDOWS)).toEqual({
			used: 8,
			available: 10,
			cached: 2,
			free: 8,
			total: 18,
			swap_total: 4,
			swap_used: 1
		});
	});

	it('ignores a bogus zero total from Windows', () => {
		const stats = { used: 8, available: 10, cached: 2, total: 0 };
		expect(normalizeMemStats(stats).total).toBe(18);
	});

	it('maps page_* swap to swap_*', () => {
		expect(normalizeMemStats(WINDOWS).swap_total).toBe(4);
		expect(normalizeMemStats(WINDOWS).swap_used).toBe(1);
	});

	it('never reports a negative free value', () => {
		const stats = { used: 20, cached: 5, total: 20 };
		expect(normalizeMemStats(stats).free).toBe(0);
	});
});

describe('totalMemBytes', () => {
	it('sums used + free + cached for Linux', () => {
		expect(totalMemBytes(LINUX)).toBe(11);
	});

	it('falls back to used + available on Windows', () => {
		expect(totalMemBytes(WINDOWS)).toBe(18);
	});
});

describe('diskKey', () => {
	it('prefers dev on Linux', () => {
		expect(diskKey({ dev: '/dev/sda1', name: 'sda1' }, 0)).toBe('/dev/sda1');
	});

	it('falls back to name on Windows', () => {
		expect(diskKey({ name: 'C:' }, 0)).toBe('C:');
	});

	it('falls back to the index as a last resort', () => {
		expect(diskKey({}, 3)).toBe('disk-3');
	});
});
