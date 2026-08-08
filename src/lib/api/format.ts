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

export function last(values: number[] | undefined): number {
	return values && values.length ? values[values.length - 1] : 0;
}

export function formatJiffies(jiffies: number, clockTicks = 100): string {
	if (!Number.isFinite(jiffies) || jiffies <= 0) return '—';
	const totalSec = Math.floor(jiffies / clockTicks);
	const days = Math.floor(totalSec / 86400);
	const hours = Math.floor((totalSec % 86400) / 3600);
	const minutes = Math.floor((totalSec % 3600) / 60);
	const seconds = totalSec % 60;
	const hh = String(hours).padStart(2, '0');
	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');
	return days > 0 ? `${days}-${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

export function formatMilliwatts(mw: number): string {
	return `${(mw / 1000).toFixed(1)} W`;
}

export function formatKibsPerSec(kibs: number): string {
	return formatSpeed(kibs * 1024);
}

export function gradientStop(value: number, start: string, mid: string, end: string): string {
	if (value < 50) {
		const t = value / 50;
		return mixHex(start, mid, t);
	}
	const t = (value - 50) / 50;
	return mixHex(mid, end, t);
}

function mixHex(a: string, b: string, t: number): string {
	const pa = hexToRgb(a);
	const pb = hexToRgb(b);
	const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
	const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
	const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
	return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
	const value = hex.replace('#', '');
	if (value.length === 3) {
		return [
			parseInt(value[0] + value[0], 16),
			parseInt(value[1] + value[1], 16),
			parseInt(value[2] + value[2], 16)
		];
	}
	return [
		parseInt(value.slice(0, 2), 16),
		parseInt(value.slice(2, 4), 16),
		parseInt(value.slice(4, 6), 16)
	];
}
