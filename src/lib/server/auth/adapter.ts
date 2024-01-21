import type { Adapter } from 'lucia';
import { connectRoot } from '../surql';

export async function adapter() {
	const db = await connectRoot();
	return {
		async deleteSession(sessionId) {
			// db.query()
		},

		async deleteUserSessions(userId) {},

		async getSessionAndUser(sessionId) {
			return [null, null];
		},

		async getUserSessions(userId) {
			return [];
		},

		async setSession(session) {},

		async updateSessionExpiration() {},
	} satisfies Adapter;
}
