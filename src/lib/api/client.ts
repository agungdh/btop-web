import type { BtopSnapshot, HealthResponse, IndexResponse } from './types';

const DEFAULT_BASE_URL = 'http://127.0.0.1:8080';

export function getBaseUrl(): string {
	const fromEnv = import.meta.env.VITE_BTOP_API_URL as string | undefined;
	return fromEnv?.trim().replace(/\/+$/, '') || DEFAULT_BASE_URL;
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
	const url = `${getBaseUrl()}${path}`;
	const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });

	if (!response.ok) {
		let detail = response.statusText;
		try {
			const body = await response.json();
			if (body && typeof body.error === 'string') detail = body.error;
		} catch {
			// non-JSON error body, keep statusText
		}
		throw new Error(`HTTP ${response.status}: ${detail || 'request failed'}`);
	}

	return (await response.json()) as T;
}

export function getSnapshot(signal?: AbortSignal): Promise<BtopSnapshot> {
	return request<BtopSnapshot>('/api/json', signal);
}

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
	return request<HealthResponse>('/healthz', signal);
}

export function getIndex(signal?: AbortSignal): Promise<IndexResponse> {
	return request<IndexResponse>('/', signal);
}
