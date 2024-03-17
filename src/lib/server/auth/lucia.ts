import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import type { UserNoId } from '$lib/validators/user';
import { Google } from 'arctic';
import { Lucia } from 'lucia';
import { adapter } from './adapter';

export const lucia = new Lucia(await adapter(), {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (attributes) => ({
		// googleId: attributes.googleId,
		name: attributes.name,
		email: attributes.email,
		givenName: attributes.givenName,
		familyName: attributes.familyName,
		picture: attributes.picture,
	}),
});

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserNoId;
	}
}
