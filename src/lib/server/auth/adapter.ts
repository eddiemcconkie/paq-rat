import { surql } from '$lib/surql';
import { addTable } from '$lib/validators/id';
import { Session } from '$lib/validators/session';
import { UserInternal } from '$lib/validators/user';
import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import { z } from 'zod';
import { connectRoot } from '../surql';

export async function adapter() {
	const db = await connectRoot();
	return {
		async deleteSession(sessionId) {
			await db.query(surql`DELETE type::thing('session', ${sessionId})`);
		},

		async deleteUserSessions(userId) {
			await db.query(surql`DELETE session WHERE userId = type::thing('user', ${userId})`);
		},

		async getSessionAndUser(sessionId) {
			const [session] = await db.zodQuery(
				surql`SELECT *, userId.* AS user FROM ONLY type::thing('session', ${sessionId})`,
				Session.merge(z.object({ user: UserInternal })).nullable(),
			);

			if (!session) return [null, null];

			const {
				user: { id: userId, ...userAttributes },
				...sessionAttributes
			} = session;
			const dbSession: DatabaseSession = {
				id: session.id,
				userId: session.userId,
				expiresAt: sessionAttributes.expiresAt,
				attributes: {},
			};
			const dbUser: DatabaseUser = {
				id: userId,
				attributes: userAttributes,
			};

			return [dbSession, dbUser];
		},

		async getUserSessions(userId) {
			const [sessions] = await db.zodQuery(
				surql`SELECT * FROM session WHERE userId = type::thing('user', ${userId})`,
				Session.array(),
			);

			return sessions.map(
				(session): DatabaseSession => ({
					id: session.id,
					userId: session.userId,
					expiresAt: session.expiresAt,
					attributes: {},
				}),
			);
		},

		async setSession(session) {
			await db.query(
				surql`CREATE type::thing('session', ${session.id}) CONTENT ${{ userId: addTable('user', session.userId), expiresAt: session.expiresAt, fresh: true, ...session.attributes }}`,
			);
		},

		async updateSessionExpiration(sessionId, expiresAt) {
			await db.query(
				surql`UPDATE type::thing('session', ${sessionId}) SET expiresAt = ${expiresAt}`,
			);
		},

		async deleteExpiredSessions() {
			await db.query(surql`DELETE session WHERE expiresAt < time::now()`);
		},
	} satisfies Adapter;
}
