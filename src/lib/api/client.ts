import type { BtopSnapshot, HealthResponse, IndexResponse } from './types';

export interface HostConfig {
	baseUrl: string;
	label: string;
	username?: string;
	password?: string;
}

//? Empty base = same-origin. When btop serves the app and its API from the same
//? server/port, relative URLs adapt automatically regardless of the bind address.
const LOCAL_HOST: HostConfig = { baseUrl: '', label: 'local' };

export function getHosts(): HostConfig[] {
	const raw = (import.meta.env.VITE_BTOP_API_URL as string | undefined)?.trim();
	return parseHosts(raw);
}

//? VITE_BTOP_API_URL is a comma-separated list of host URLs. Each entry may carry
//? basic auth credentials as http://user:pass@host:port. An empty value means the
//? single local host (the embedding case, when btop serves the bundle itself).
export function parseHosts(input: string | undefined): HostConfig[] {
	const raw = input?.trim();
	if (!raw) return [LOCAL_HOST];

	const hosts = raw
		.split(',')
		.map((entry) => parseHost(entry.trim()))
		.filter((host): host is HostConfig => host !== null);

	return hosts.length > 0 ? hosts : [LOCAL_HOST];
}

function parseHost(entry: string): HostConfig | null {
	if (!entry) return null;

	let normalized = entry;
	if (!/^[a-z][a-z\d+\-.]*:\/\//i.test(normalized)) normalized = `http://${normalized}`;
	normalized = normalized.replace(/\/+$/, '');

	let url: URL;
	try {
		url = new URL(normalized);
	} catch {
		return null;
	}

	const username = url.username ? decodeURIComponent(url.username) : undefined;
	const password = url.password ? decodeURIComponent(url.password) : undefined;

	url.username = '';
	url.password = '';
	const baseUrl = url.toString().replace(/\/+$/, '');

	const label = username ? `${username}@${url.host}` : url.host;
	return { baseUrl, label, username, password };
}

async function request<T>(host: HostConfig, path: string, signal?: AbortSignal): Promise<T> {
	const headers: Record<string, string> = { Accept: 'application/json' };
	if (host.username !== undefined && host.password !== undefined) {
		headers.Authorization = `Basic ${btoa(`${host.username}:${host.password}`)}`;
	}

	const response = await fetch(`${host.baseUrl}${path}`, { signal, headers });

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

export function getSnapshot(host: HostConfig, signal?: AbortSignal): Promise<BtopSnapshot> {
	return request<BtopSnapshot>(host, '/api/json', signal);
}

export function getHealth(host: HostConfig, signal?: AbortSignal): Promise<HealthResponse> {
	return request<HealthResponse>(host, '/healthz', signal);
}

export function getIndex(host: HostConfig, signal?: AbortSignal): Promise<IndexResponse> {
	return request<IndexResponse>(host, '/', signal);
}
