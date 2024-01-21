import { lucia } from '$lib/server/auth/auth';

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
	return resolve(event);

	// const rootDb = new Surreal();
	// const userDb = new Surreal();
	// await db.connect('', {});
	// event.locals.rootDb = userDb;
	// event.locals.userDb = userDb;
	// const { db, token } = await connect({ type: 'sessionId', sessionId: '' });
	// event.locals.db = db;
	// event.locals.surrealToken = token;

	return resolve(event);
}
