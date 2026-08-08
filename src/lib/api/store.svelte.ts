import { getSnapshot } from './client';
import type { BtopSnapshot } from './types';

export type DashboardStatus = 'idle' | 'connecting' | 'connected' | 'error';

const DEFAULT_POLL_MS = 2000;

class DashboardStore {
	snapshot: BtopSnapshot | null = $state(null);
	status: DashboardStatus = $state('idle');
	error: string | null = $state(null);
	lastUpdated: number | null = $state(null);

	pollMs = $state(DEFAULT_POLL_MS);

	private timer: ReturnType<typeof setTimeout> | null = null;
	private controller: AbortController | null = null;

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
			const snapshot = await getSnapshot(this.controller.signal);
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

export const dashboard = new DashboardStore();
