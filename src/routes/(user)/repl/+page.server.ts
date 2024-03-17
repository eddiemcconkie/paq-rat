import { assertSignedIn } from '$lib/server/signed-in.js';
import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	assertSignedIn(locals, url);
	if (import.meta.env.PROD) {
		redirect(307, '/welcome');
	}
}
