import { google } from '$lib/server/auth/auth.js';
import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { serializeCookie } from 'oslo/cookie';

export async function GET({ cookies }) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier);

	cookies.set('oauth_state', state, {
		httpOnly: true,
		maxAge: 60 * 10,
		path: '/',
		secure: import.meta.env.PROD,
	});
	cookies.set('oauth_code_verifier', codeVerifier, {
		httpOnly: true,
		maxAge: 60 * 10,
		path: '/',
		secure: import.meta.env.PROD,
	});

	redirect(302, url.toString());
}
