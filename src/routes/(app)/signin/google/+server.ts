import { google } from '$lib/server/auth/lucia.js';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET({ cookies, url }) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const authorizationUrl = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
			'openid',
		],
	});

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

	const redirectTo = url.searchParams.get('redirect_to');
	if (redirectTo && redirectTo.startsWith('/')) {
		cookies.set('redirect_to', redirectTo, {
			httpOnly: true,
			maxAge: 60 * 10,
			path: '/',
			secure: import.meta.env.PROD,
		});
	}

	redirect(302, authorizationUrl.toString());
}
// export const actions = {
// 	async google({ cookies }) {
// 		const state = generateState();
// 		const codeVerifier = generateCodeVerifier();
// 		const url = await google.createAuthorizationURL(state, codeVerifier, {
// 			scopes: [
// 				'https://www.googleapis.com/auth/userinfo.email',
// 				'https://www.googleapis.com/auth/userinfo.profile',
// 				'openid',
// 			],
// 		});

// 		cookies.set('oauth_state', state, {
// 			httpOnly: true,
// 			maxAge: 60 * 10,
// 			path: '/',
// 			secure: import.meta.env.PROD,
// 		});
// 		cookies.set('oauth_code_verifier', codeVerifier, {
// 			httpOnly: true,
// 			maxAge: 60 * 10,
// 			path: '/',
// 			secure: import.meta.env.PROD,
// 		});

// 		redirect(302, url.toString());
// 	},
// };
