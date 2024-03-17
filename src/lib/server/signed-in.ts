import { redirect } from '@sveltejs/kit';

type SignedInLocals = {
	session: NonNullable<App.Locals['session']>;
	user: NonNullable<App.Locals['user']>;
	db: NonNullable<App.Locals['db']>;
	surrealToken: NonNullable<App.Locals['surrealToken']>;
	selectedGroupId: NonNullable<App.Locals['selectedGroupId']>;
};

export function assertSignedIn(
	locals: App.Locals,
	redirectUrl?: URL,
): asserts locals is SignedInLocals {
	if (!locals.session || !locals.user) {
		redirect(
			307,
			redirectUrl
				? `/welcome?redirect_to=${redirectUrl.pathname}${redirectUrl.search}`
				: '/welcome',
		);
	}
}

export function isSignedIn(locals: App.Locals): locals is SignedInLocals {
	return Boolean(locals.session && locals.user);
}
