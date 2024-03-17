// See https://kit.svelte.dev/docs/types#app

import type { DB } from '$lib/surql';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			db: DB | null;
			surrealToken: string | null;
			selectedGroupId: string | null;
		}
		interface PageData {
			user: import('lucia').User | null;
			surrealToken: string | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
