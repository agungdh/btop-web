const BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

export function formatBytes(bytes: number, decimals = 1): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
	const value = bytes / 1024 ** i;
	return `${value.toFixed(i === 0 ? 0 : decimals)} ${BYTE_UNITS[i]}`;
}

const BIT_UNITS = ['B/s', 'Kb/s', 'Mb/s', 'Gb/s', 'Tb/s'];

export function formatSpeed(bytesPerSec: number, decimals = 1): string {
	if (!Number.isFinite(bytesPerSec) || bytesPerSec <= 0) return '0 B/s';
	const i = Math.min(Math.floor(Math.log(bytesPerSec) / Math.log(1000)), BIT_UNITS.length - 1);
	const value = bytesPerSec / 1000 ** i;
	return `${value.toFixed(i === 0 ? 0 : decimals)} ${BIT_UNITS[i]}`;
}

export function formatPercent(value: number, decimals = 0): string {
	if (!Number.isFinite(value)) return '0%';
	return `${value.toFixed(decimals)}%`;
}

export function formatUptime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return '—';
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (days > 0) return `${days}d ${hours}h ${minutes}m`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m ${Math.floor(seconds % 60)}s`;
}

export function formatTimestamp(timestamp: string): string {
	if (!timestamp) return '—';
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) return timestamp;
	return date.toLocaleTimeString();
}

export function formatTemp(temp: number): string {
	return `${Math.round(temp)}°C`;
}

export function formatSigned(value: number): string {
	return `${value >= 0 ? '+' : '−'}${Math.abs(value)}`;
}

export function clamp(value: number, min = 0, max = 100): number {
	return Math.min(Math.max(value, min), max);
}
