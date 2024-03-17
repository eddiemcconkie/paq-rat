import { assertSignedIn } from '$lib/server/signed-in.js';
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	assertSignedIn(locals);
	redirect(302, '/');
}

// export const actions = {
// 	async create({ cookies, locals, url }) {
// 		assertSignedIn(locals);

// 		const groupId = url.searchParams.get('groupId');
// 		if (!groupId) {
// 			error(400, 'Missing group id');
// 		}
// 		groupCookie.set(cookies, groupId);

// 		// TODO:
// 		// Remember user preference for visibility, but only when creating containers for own groups
// 		const mostRecentVisibility: Role = 'owner';

// 		const containerId = await ContainerDB.addContainerToGroup(locals.db, {
// 			groupId,
// 			mostRecentVisibility,
// 		});

// 		redirect(302, `/qr/${containerId}`);
// 	},
// };
