import { lucia } from '$lib/server/auth/lucia';
import { connect, surql } from '$lib/surql';
import { record } from '$lib/validators/id';
import { groupCookie } from './cookies.server';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: sessionCookie.attributes.path ?? '/',
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: sessionCookie.attributes.path ?? '/',
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	if (session) {
		const { db, token } = await connect({ type: 'sessionId', sessionId: session.id });
		event.locals.db = db;
		event.locals.surrealToken = token;

		// Get the currently selected group, or default to the user's group
		const groupIdCookie = groupCookie.get(event.cookies);
		const [groupId] = await db.zodQuery(
			surql`
				fn::group_for_container(type::thing('container', ${event.params.containerId}))
				OR type::thing('group', ${groupIdCookie}).id \
				OR fn::owned_group()
			`,
			record(),
		);
		event.locals.selectedGroupId = groupId;
		groupCookie.set(event.cookies, groupId);
	}

	return resolve(event);
}
