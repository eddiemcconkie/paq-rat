const { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB, SURREAL_USER, SURREAL_PASS } =
	Bun.env;

if (
	!PUBLIC_SURREAL_HOST ||
	!PUBLIC_SURREAL_NS ||
	!PUBLIC_SURREAL_DB ||
	!SURREAL_USER ||
	!SURREAL_PASS
) {
	console.log(
		'Missing .env variables! Make sure you have defined: PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB, SURREAL_USER, SURREAL_PASS',
	);
	process.exit(1);
}

type Result<T> =
	| {
			status: 'OK';
			result: T;
	  }
	| {
			status: 'ERR';
			result: string;
	  };

type Results<T extends readonly unknown[]> = T extends [infer First, ...infer Rest]
	? [Result<First>, ...Results<Rest>]
	: T;

export function execSql<TResults extends unknown[]>(sql: string): Results<TResults> {
	const signal = Bun.spawnSync([
		'curl',
		'-X',
		'POST',
		'-u',
		`${SURREAL_USER}:${SURREAL_PASS}`,
		'-H',
		`NS: ${PUBLIC_SURREAL_NS}`,
		'-H',
		`DB: ${PUBLIC_SURREAL_DB}`,
		'-H',
		'Accept: application/json',
		'-d',
		sql,
		`${PUBLIC_SURREAL_HOST}/sql`,
	]);

	if (!signal.success) {
		process.exit(1);
	}

	return JSON.parse(signal.stdout.toString());
}
