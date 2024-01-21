import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { adapter } from './adapter';
import { Google } from 'arctic';
import { Lucia } from 'lucia';

export const lucia = new Lucia(await adapter(), {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (attributes) => ({
		googleId: attributes.google_id,
		username: attributes.username,
	}),
});

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			google_id: number;
			username: string;
		};
	}
}
