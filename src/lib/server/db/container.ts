import { surql, type DB } from '$lib/surql';
import { record } from '$lib/validators/id';
import { Role } from '$lib/validators/role';
import { z } from 'zod';
import { connectRoot } from '../surql';

export namespace ContainerDB {
	export async function addContainerToGroup(
		userDb: DB,
		data: { groupId: string; containerId?: string; mostRecentVisibility: Role },
	) {
		console.log(data);
		const [groupRole] = await userDb.zodQuery(
			surql`{
				LET $group = type::thing('group', ${data.groupId});
				RETURN fn::role_for_group($group);
			}`,
			Role,
		);

		const rootDb = await connectRoot();
		const [containerId] = await rootDb.zodQuery(
			surql`
				BEGIN TRANSACTION;
			
				LET $group = type::thing('group', ${data.groupId});
				LET $group_role = type::thing('role', ${groupRole});
				LET $most_recent_visibility = type::thing('role', ${data.mostRecentVisibility});
				LET $container_visibility = IF $group_role = role:owner THEN $most_recent_visibility ELSE $group_role END;
				LET $container = (
          CREATE ONLY container SET
            id = ${data.containerId} OR rand::uuid(),
            visibility = $container_visibility
        );
				RELATE $group->stores->$container;
				RETURN $container.id;

				COMMIT TRANSACTION;
			`,
			record(),
		);

		return containerId;
	}
	export async function containerExists(containerId: string) {
		const rootDb = await connectRoot();
		const [exists] = await rootDb.zodQuery(
			surql`
        fn::record_exists(type::thing('container', ${containerId}))
      `,
			z.boolean(),
		);
		return exists;
	}
}
