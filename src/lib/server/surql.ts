import { SURREAL_PASS, SURREAL_USER } from '$env/static/private';
import { PUBLIC_SURREAL_DB, PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS } from '$env/static/public';
import { DB } from '$lib/surql';

export async function connectRoot() {
	const db = new DB();
	await db.connect(PUBLIC_SURREAL_HOST + '/rpc', {
		auth: {
			username: SURREAL_USER,
			password: SURREAL_PASS,
			namespace: PUBLIC_SURREAL_NS,
			database: PUBLIC_SURREAL_DB,
		},
		namespace: PUBLIC_SURREAL_NS,
		database: PUBLIC_SURREAL_DB,
	});
	return db;
}
