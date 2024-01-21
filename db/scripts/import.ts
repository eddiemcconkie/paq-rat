export function importFile(file: string) {
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

	return Bun.spawnSync([
		'surreal',
		'import',
		'--endpoint',
		PUBLIC_SURREAL_HOST,
		'--ns',
		PUBLIC_SURREAL_NS,
		'--db',
		PUBLIC_SURREAL_DB,
		'--user',
		SURREAL_USER,
		'--pass',
		SURREAL_PASS,
		file,
	]);
}
