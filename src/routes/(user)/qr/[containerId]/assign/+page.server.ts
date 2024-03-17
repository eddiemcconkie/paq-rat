import { ContainerDB } from '$lib/server/db/container.js';
import { assertSignedIn } from '$lib/server/signed-in.js';
import type { Role } from '$lib/validators/role.js';
import { error, redirect } from '@sveltejs/kit';
import { groupCookie } from '../../../../../cookies.server.js';

export async function load({ locals, params }) {
	assertSignedIn(locals);

	if (await ContainerDB.containerExists(params.containerId)) {
		error(400);
	}

	return {
		containerId: params.containerId,
	};
}

export const actions = {
	async assign({ cookies, locals, params, url }) {
		assertSignedIn(locals);

		const groupId = url.searchParams.get('groupId');
		if (!groupId) {
			error(400, 'Missing group id');
		}
		groupCookie.set(cookies, groupId);

		if (await ContainerDB.containerExists(params.containerId)) {
			error(400);
		}

		// TODO:
		// Remember user preference for visibility, but only when creating containers for own groups
		const mostRecentVisibility: Role = 'owner';

		const containerId = await ContainerDB.addContainerToGroup(locals.db, {
			groupId,
			containerId: params.containerId,
			mostRecentVisibility,
		});
		// const rootDb = await connectRoot();
		// const [containerId] = await rootDb.zodQuery(
		// 	surql`
		// 		BEGIN TRANSACTION;

		// 		LET $group = type::thing('group', ${groupId});
		// 		LET $group_role = type::thing('role', ${groupRole});
		// 		LET $most_recent_visibility = type::thing('role', ${mostRecentVisibility});
		// 		LET $container_visibility = IF $group_role = role:owner THEN $most_recent_visibility ELSE $group_role END;
		// 		LET $container = (CREATE ONLY container SET id = rand::uuid(), visibility = $container_visibility);
		// 		RELATE $group->stores->$container;
		// 		RETURN $container.id;

		// 		COMMIT TRANSACTION;
		// 	`,
		// 	z.any(),
		// );
		redirect(302, `/qr/${params.containerId}`);
	},
};
