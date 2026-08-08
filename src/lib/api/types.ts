export interface Meta {
	version: string;
	git_commit: string;
	timestamp: string;
	uptime: number;
	hostname: string;
	username: string;
	cpu_name: string;
	cpu_frequency: string;
	cores: number;
	platform: string | null;
	kernel: string | null;
	container_engine: string | null;
}

export interface Battery {
	charge: number;
	watts: number;
	time_left: number;
	status: string;
}

export interface CpuSection {
	name: string;
	frequency: string;
	cores: number;
	percent: Record<string, number[]>;
	core_percent: number[][];
	temp: number[][];
	temp_max: number;
	load_avg: number[];
	usage_watts: number;
	active_cpus: number[] | null;
	battery: Battery;
}

export interface MemStats {
	used: number;
	available: number;
	cached: number;
	free: number;
	swap_total: number;
	swap_used: number;
	swap_free: number;
}

export interface Disk {
	dev: string;
	name: string;
	fstype: string;
	total: number;
	used: number;
	free: number;
	used_percent: number;
	free_percent: number;
	io_read: number[];
	io_write: number[];
	io_activity: number[];
}

export interface MemSection {
	stats: MemStats;
	percent: Record<string, number[]>;
	disks: Disk[];
}

export interface NetTransfer {
	speed: number;
	total: number;
}

export interface NetInterface {
	connected: boolean;
	ipv4: string;
	ipv6: string;
	download: NetTransfer;
	upload: NetTransfer;
}

export interface NetSection {
	interfaces: string[];
	current: Record<string, NetInterface>;
}

export interface ProcEntry {
	pid: number;
	name: string;
	cmd: string;
	short_cmd: string;
	threads: number;
	user: string;
	mem: number;
	cpu_percent: number;
	cpu_cumulative: number;
	state: string;
	nice: number;
	ppid: number;
	cpu_system: number;
	cpu_time: number;
	death_time: number;
	depth: number;
	collapsed: boolean;
	filtered: boolean;
}

export interface ProcDetail {
	pid: number;
	name: string;
	cmd: string;
	user: string;
	state: string;
	status: string;
	elapsed: string;
	parent: string;
	ppid: number;
	mem: number;
	memory: string;
	io_read: string;
	io_write: string;
	cpu_percent: number;
	cpu_percent_history: number[];
	mem_bytes_history: number[];
}

export interface ProcSection {
	count: number;
	detailed?: ProcDetail;
	list: ProcEntry[];
}

export interface BtopSnapshot {
	meta: Meta;
	cpu?: CpuSection;
	mem?: MemSection;
	net?: NetSection;
	proc?: ProcSection;
	gpu?: unknown[];
}

export interface IndexResponse {
	name: string;
	version: string;
	uptime: number;
	endpoints: { method: string; path: string; description: string }[];
}

export interface HealthResponse {
	status: string;
}
