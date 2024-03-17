import { ContainerDB } from '$lib/server/db/container.js';
import { assertSignedIn } from '$lib/server/signed-in.js';
import { surql } from '$lib/surql.js';
import { Container } from '$lib/validators/container.js';
import { isUUID } from '$lib/validators/uuid';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, params, url }) {
	assertSignedIn(locals, url);

	if (!isUUID(params.containerId)) {
		error(400, 'Invalid code');
	}

	// If the container doesn't exist, redirect to assign it to a group
	if (!(await ContainerDB.containerExists(params.containerId))) {
		redirect(302, `/qr/${params.containerId}/assign`);
	}

	// If the container exists, load it
	const [container] = await locals.db.zodQuery(
		surql`SELECT * FROM ONLY type::thing('container', ${params.containerId})`,
		Container.nullable(),
	);
	if (!container) {
		error(404);
	}

	return { container: container };
}
