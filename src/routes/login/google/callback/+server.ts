import { google as googleAuth, lucia } from '$lib/server/auth/auth';
import { error } from '@sveltejs/kit';
import { OAuth2RequestError, generateCodeVerifier } from 'arctic';
import { generateId } from 'lucia';
import { parseCookies } from 'oslo/cookie';
import { google as googleApi } from 'googleapis';
import { surql } from '$lib/surql.js';
import { User } from '$lib/schema/user.js';
import { connectRoot } from '$lib/server/surql.js';

export async function GET({ cookies, fetch, url }) {
	const stateCookie = cookies.get('oauth_state');
	const codeVerifier = cookies.get('oauth_code_verifier');

	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// verify state
	if (!state || !stateCookie || !code || stateCookie !== state || !codeVerifier) {
		return error(400);
	}

	try {
		const tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier);

		const userInfo = await googleApi.oauth2('v2').userinfo.get({ auth: tokens.accessToken });
		if (userInfo.status !== 200) {
			return error(500, 'user info request failed');
		}
		const googleUser = userInfo.data;
		if (!googleUser.id) {
			return error(500, 'missing user id');
		}

		const db = await connectRoot();
		const [existingUser] = await db.zodQuery(
			surql`SELECT ONLY * FROM user WHERE googleId = ${googleUser.id}`,
			User.nullable(),
		);
		const user = existingUser.success ? existingUser.data : zodError(existingUser.error.message);
		// google.oauth2('v2').userinfo.get({auth:access})
	} catch (error) {}
}

function zodError(e: string): never {
	throw new Error(e);
}

// app.get("/login/github/callback", async (request: Request): Promise<Response> => {
// 	const cookies = parseCookies(request.headers.get("Cookie") ?? "");
// 	const stateCookie = cookies.get("oauth_state") ?? null;

// 	const url = new URL(request.url);
// 	const state = url.searchParams.get("state");
// 	const code = url.searchParams.get("code");

// 	// verify state
// 	if (!state || !stateCookie || !code || stateCookie !== state) {
// 		return new Response(null, {
// 			status: 400
// 		});
// 	}

// 	try {
// 		const tokens = await github.validateAuthorizationCode(code);
// 		const githubUserResponse = await fetch("https://api.github.com/user", {
// 			headers: {
// 				Authorization: `Bearer ${tokens.accessToken}`
// 			}
// 		});
// 		const githubUserResult: GitHubUserResult = await githubUserResponse.json();

// 		const existingUser = await db.table("user").where("github_id", "=", githubUserResult.id).get();

// 		if (existingUser) {
// 			const session = await lucia.createSession(existingUser.id, {});
// 			const sessionCookie = lucia.createSessionCookie(session.id);
// 			return new Response(null, {
// 				status: 302,
// 				headers: {
// 					Location: "/",
// 					"Set-Cookie": sessionCookie.serialize()
// 				}
// 			});
// 		}

// 		const userId = generateId(15);
// 		await db.table("user").insert({
// 			id: userId,
// 			username: githubUserResult.login,
// 			github_id: githubUserResult.id
// 		});

// 		const session = await lucia.createSession(userId, {});
// 		const sessionCookie = lucia.createSessionCookie(session.id);
// 		return new Response(null, {
// 			status: 302,
// 			headers: {
// 				Location: "/",
// 				"Set-Cookie": sessionCookie.serialize()
// 			}
// 		});
// 	} catch (e) {
// 		console.log(e);
// 		if (e instanceof OAuth2RequestError) {
// 			// bad verification code, invalid credentials, etc
// 			return new Response(null, {
// 				status: 400
// 			});
// 		}
// 		return new Response(null, {
// 			status: 500
// 		});
// 	}
// });

// interface GitHubUserResult {
// 	id: number;
// 	login: string; // username
// }

interface GoogleUserResult {
	// id: number
}
