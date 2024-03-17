import { DB, connect } from '$lib/surql';
import { getContext, setContext } from 'svelte';

const WS_CLIENT = 'ws-client';

export function createDbContext(surrealToken: string) {
	const connection = connect({ type: 'token', token: surrealToken }).then(({ db }) => db);
	setContext(WS_CLIENT, connection);
	return {
		closeConnection() {
			connection.then((db) => db.close());
		},
	};
}

export function getDbContext() {
	return getContext<Promise<DB>>(WS_CLIENT);
}
