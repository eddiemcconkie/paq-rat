import { lucia } from '$lib/server/auth/lucia.js';
import { assertSignedIn } from '$lib/server/signed-in.js';
import { redirect } from '@sveltejs/kit';

export function GET({ locals }) {
	assertSignedIn(locals);
	lucia.invalidateSession(locals.session.id);
	redirect(307, '/welcome');
}
