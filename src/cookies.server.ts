import type { Cookies } from '@sveltejs/kit';
import { TimeSpan } from 'lucia';

const SELECTED_GROUP_ID_COOKIE = 'selected_group_id';

export const groupCookie = {
	set(cookies: Cookies, groupId: string) {
		cookies.set(SELECTED_GROUP_ID_COOKIE, groupId, {
			path: '/',
			maxAge: new TimeSpan(30, 'd').seconds(),
		});
	},
	get(cookies: Cookies) {
		return cookies.get(SELECTED_GROUP_ID_COOKIE);
	},
};
