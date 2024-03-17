import { google as googleAuth, lucia } from '$lib/server/auth/lucia';
import { connectRoot } from '$lib/server/surql.js';
import { surql } from '$lib/surql.js';
import { User } from '$lib/validators/user.js';
import { error, redirect } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { google as googleApi } from 'googleapis';
import { generateId } from 'lucia';

export async function GET({ cookies, url }) {
	const stateCookie = cookies.get('oauth_state');
	const codeVerifier = cookies.get('oauth_code_verifier');

	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// verify state
	if (!state || !stateCookie || !code || stateCookie !== state || !codeVerifier) {
		return error(400);
	}

	let userId: string;

	try {
		const tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier);

		const userInfo = await googleApi.oauth2('v2').userinfo.get({ oauth_token: tokens.accessToken });
		// const userInfo = await googleApi.oauth2('v2').userinfo.get({ auth: tokens.accessToken });
		if (userInfo.status !== 200) {
			return error(500, 'user info request failed');
		}
		const googleUser = userInfo.data;
		if (!googleUser.id) {
			return error(500, 'missing user id');
		}

		const db = await connectRoot();
		const [existingUser] = await db.zodQuery(
			surql`SELECT * FROM ONLY user WHERE googleId = ${googleUser.id} LIMIT 1`,
			User.nullable(),
		);

		userId = existingUser ? existingUser.id : generateId(15);

		if (!existingUser) {
			await db.query(
				surql`CREATE type::thing('user', ${userId}) CONTENT ${{
					googleId: googleUser.id,
					givenName: googleUser.given_name,
					familyName: googleUser.family_name,
					name: googleUser.name,
					email: googleUser.email,
					picture: googleUser.picture,
				}}`,
			);
		}
	} catch (e) {
		console.log(e);
		if (e instanceof OAuth2RequestError) {
			// bad verification code, invalid credentials, etc
			return error(400);
		}
		return error(500);
	}

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		...sessionCookie.attributes,
		path: sessionCookie.attributes.path ?? '/',
	});

	const redirectTo = cookies.get('redirect_to') ?? '/';
	cookies.delete('redirect_to', { path: '/' });

	redirect(302, redirectTo);
}
