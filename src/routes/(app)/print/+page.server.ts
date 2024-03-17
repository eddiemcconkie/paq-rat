import { assertSignedIn } from '$lib/server/signed-in.js';

export const ssr = false;

export function load({ locals }) {
	assertSignedIn(locals);
}
