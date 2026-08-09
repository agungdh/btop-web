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

	interface ImportMetaEnv {
		//? Comma-separated list of btop API base URLs when the SPA is served separately
		//? (standalone/client-server). Each entry may embed basic auth as http://user:pass@host:port.
		//? Empty/undefined = single local host on the same origin (default when btop serves the bundle itself).
		readonly VITE_BTOP_API_URL?: string;
	}
}

export {};
