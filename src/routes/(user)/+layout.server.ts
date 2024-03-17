import { assertSignedIn } from '$lib/server/signed-in.js';
import { surql } from '$lib/surql.js';
import { record } from '$lib/validators/id.js';
import { Role } from '$lib/validators/role.js';
import { User } from '$lib/validators/user.js';
import { error } from '@sveltejs/kit';
import { sortBy } from 'lodash-es';
import { z } from 'zod';
import { SELECTED_GROUP } from './depends.js';

export async function load({ depends, locals }) {
	depends(SELECTED_GROUP);
	assertSignedIn(locals);
	const [groups] = await locals.db.zodQuery(
		surql`
			SELECT
				out AS id,
				fn::group_owner(out) AS owner,
				role
			FROM $auth->belongs_to
			FETCH owner
		`,
		z
			.object({
				id: record(),
				owner: User,
				role: Role,
			})
			.array(),
	);

	const sortedGroups = sortBy(groups, (group) => {
		switch (group.role) {
			case 'owner':
				return 1;
			case 'family':
				return 2;
			case 'friend':
				return 3;
		}
	});

	const selectedGroup = groups.find((g) => g.id === locals.selectedGroupId);
	if (!selectedGroup) {
		error(500);
	}

	return {
		user: locals.user,
		surrealToken: locals.surrealToken,
		groups: sortedGroups,
		selectedGroup: {
			...selectedGroup,
			isOwn: selectedGroup.role === 'owner',
		},
		// containers,
	};
}
