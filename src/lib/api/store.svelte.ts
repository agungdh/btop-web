import { getHosts, getSnapshot, type HostConfig } from './client';
import type { BtopSnapshot } from './types';

export type DashboardStatus = 'idle' | 'connecting' | 'connected' | 'error';

const DEFAULT_POLL_MS = 2000;

class HostStore {
	config: HostConfig;

	snapshot: BtopSnapshot | null = $state(null);
	status: DashboardStatus = $state('idle');
	error: string | null = $state(null);
	lastUpdated: number | null = $state(null);

	private pollMs = DEFAULT_POLL_MS;
	private timer: ReturnType<typeof setTimeout> | null = null;
	private controller: AbortController | null = null;

	constructor(config: HostConfig) {
		this.config = config;
	}

	start(pollMs: number = DEFAULT_POLL_MS): void {
		this.pollMs = pollMs;
		if (this.timer !== null) return;
		void this.tick();
	}

	stop(): void {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.controller?.abort();
		this.controller = null;
	}

	refresh(): void {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		void this.tick();
	}

	private async tick(): Promise<void> {
		if (this.status === 'idle' || this.status === 'error') {
			this.status = 'connecting';
			this.error = null;
		}

		this.controller?.abort();
		this.controller = new AbortController();

		try {
			const snapshot = await getSnapshot(this.config, this.controller.signal);
			this.snapshot = snapshot;
			this.status = 'connected';
			this.error = null;
			this.lastUpdated = Date.now();
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return;
			this.status = 'error';
			this.error = err instanceof Error ? err.message : String(err);
		}

		this.timer = setTimeout(() => void this.tick(), this.pollMs);
	}
}

class DashboardStore {
	hosts: HostStore[] = $state([]);
	activeIndex = $state(0);

	constructor() {
		this.hosts = getHosts().map((config) => new HostStore(config));
	}

	get activeHost(): HostStore | undefined {
		return this.hosts[this.activeIndex] ?? this.hosts[0];
	}

	get snapshot(): BtopSnapshot | null {
		return this.activeHost?.snapshot ?? null;
	}

	get status(): DashboardStatus {
		return this.activeHost?.status ?? 'idle';
	}

	get error(): string | null {
		return this.activeHost?.error ?? null;
	}

	get lastUpdated(): number | null {
		return this.activeHost?.lastUpdated ?? null;
	}

	select(index: number): void {
		if (index >= 0 && index < this.hosts.length) this.activeIndex = index;
	}

	start(pollMs: number = DEFAULT_POLL_MS): void {
		for (const host of this.hosts) host.start(pollMs);
	}

	stop(): void {
		for (const host of this.hosts) host.stop();
	}
}

export const dashboard = new DashboardStore();
