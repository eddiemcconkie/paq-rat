import { assertSignedIn } from '$lib/server/signed-in.js';
import { surql } from '$lib/surql.js';
import { Container } from '$lib/validators/container.js';
import { error, redirect } from '@sveltejs/kit';
import { groupCookie } from '../../cookies.server.js';
import { GROUP_CONTAINER_LIST } from './depends.js';

export async function load({ depends, locals, url }) {
	depends(GROUP_CONTAINER_LIST);
	assertSignedIn(locals, url);

	const [containers] = await locals.db.zodQuery(
		surql`{
			LET $containers = (type::thing('group', ${locals.selectedGroupId}))->stores->container.*;
			RETURN SELECT * FROM $containers ORDER BY updated DESC;
		}`,
		Container.array(),
	);
	return { containers };
}

export const actions = {
	async setGroup({ cookies, locals, url }) {
		assertSignedIn(locals);
		const groupId = url.searchParams.get('groupId');
		if (!groupId) {
			error(400, 'Missing group id');
		}
		groupCookie.set(cookies, groupId);
		redirect(302, '/');
	},
};
