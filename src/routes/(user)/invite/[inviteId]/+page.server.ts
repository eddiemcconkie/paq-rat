import { assertSignedIn } from '$lib/server/signed-in.js';
import { connectRoot } from '$lib/server/surql.js';
import { surql } from '$lib/surql.js';
import { record } from '$lib/validators/id.js';
import { Role } from '$lib/validators/role.js';
import { User } from '$lib/validators/user.js';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { groupCookie } from '../../../../cookies.server.js';

export async function load({ locals, params, url }) {
	assertSignedIn(locals, url);

	const [user] = await locals.db.zodQuery(surql`$auth`, record());
	const rootDb = await connectRoot();
	const [invite] = await rootDb.zodQuery(
		surql`{
			LET $user = type::thing('user', ${user});
			LET $invite = type::thing('invite', ${params.inviteId});

			RETURN IF fn::not_record_exists($invite) THEN
				{ status: 'nonexistent' }
			ELSE IF $invite.group INSIDE $user->belongs_to->group THEN
				{ status: 'joined' }
			ELSE IF $invite.expires < time::now() THEN
				{ status: 'expired' }
			ELSE
				{
					status: 'invited',
					owner: $invite.owner.*,
					role: $invite.role
				}
			END;
		}`,
		z.discriminatedUnion('status', [
			z.object({ status: z.literal('nonexistent') }),
			z.object({ status: z.literal('joined') }),
			z.object({ status: z.literal('expired') }),
			z.object({
				status: z.literal('invited'),
				owner: User,
				role: Role,
			}),
		]),
	);
	if (invite.status === 'nonexistent') {
		error(404);
	}
	if (invite.status === 'joined') {
		redirect(303, '/');
	}

	return { invite };
}

export const actions = {
	async acceptInvite({ cookies, locals, params, url }) {
		assertSignedIn(locals, url);

		const [user] = await locals.db.zodQuery(surql`$auth`, record());
		const rootDb = await connectRoot();
		const [invite] = await rootDb.zodQuery(
			surql`{
				LET $user = type::thing('user', ${user});
				LET $invite = type::thing('invite', ${params.inviteId});
				LET $group = $invite.group;
				
				RETURN IF fn::not_record_exists($invite) THEN
					{ status: 'nonexistent' }
				ELSE IF $group INSIDE $user->belongs_to->group THEN
					{ status: 'joined', group: $group }
				ELSE IF $invite.expires < time::now() THEN
					{ status: 'expired' }
				ELSE {
					RELATE $user->belongs_to->$group SET role = $invite.role;
					RETURN { status: 'invited', group: $group };
				} END;
			}`,
			z.discriminatedUnion('status', [
				z.object({ status: z.literal('nonexistent') }),
				z.object({ status: z.literal('expired') }),
				z.object({ status: z.enum(['joined', 'invited']), group: record() }),
			]),
		);
		if (invite.status === 'nonexistent') {
			error(404);
		}
		if (invite.status === 'expired') {
			error(400, 'Invite expired');
		}
		groupCookie.set(cookies, invite.group);
		redirect(303, '/');
	},
};
