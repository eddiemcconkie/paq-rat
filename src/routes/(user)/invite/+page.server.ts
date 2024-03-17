import { assertSignedIn } from '$lib/server/signed-in.js';
import { surql } from '$lib/surql.js';
import { Invite } from '$lib/validators/invite.js';
import { fail } from '@sveltejs/kit';

export const ssr = false;

export function load({ locals, url }) {
	assertSignedIn(locals, url);
}

export const actions = {
	async create({ locals, url }) {
		assertSignedIn(locals, url);

		const role = url.searchParams.get('role');
		// console.log(role);

		if (role !== 'family' && role !== 'friend') {
			return fail(400, { message: 'Role must be "family" or "friend"' });
		}

		try {
			// console.log({ locals });
			const [invite] = await locals.db.zodQuery(
				surql`
					CREATE ONLY invite SET
						owner = $auth,
						group = ($auth->(belongs_to WHERE role = role:owner)->group)[0],
						role = type::thing('role', ${role})
					;
				`,
				Invite,
			);
			return invite;
		} catch (error) {
			return fail(500);
		}
	},
};
