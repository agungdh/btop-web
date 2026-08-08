// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface ImportMetaEnv {
	//? Base URL of the btop API when the SPA is served separately (standalone/client-server).
	//? Empty/undefined = same-origin (default when btop serves the bundle itself).
	readonly VITE_BTOP_API_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
