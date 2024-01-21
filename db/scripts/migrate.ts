import { resolve } from 'path';
import { execSql } from './execute-sql';
import { importFile } from './import';

export function runMigrations() {
	const [finishedMigrations] = execSql<[string[]]>(
		'SELECT VALUE name FROM migration ORDER BY name ASC',
	);
	if (finishedMigrations.status !== 'OK') {
		console.log("Couldn't get migrations");
		process.exit(1);
	}

	const latestMigration = finishedMigrations.result.at(-1);

	const migrationDir = resolve(import.meta.dir, '..', 'schema', 'migrations');
	const glob = new Bun.Glob('./*.surql');
	const migrationFiles = Array.from(glob.scanSync({ absolute: true, cwd: migrationDir }))
		.map((path) => {
			const name = path.split('/').at(-1) ?? '';
			return { path, name };
		})
		.sort((a, b) => (a.name > b.name ? 1 : -1));

	const newMigrations = latestMigration
		? migrationFiles.filter((migration) => migration.name > latestMigration)
		: migrationFiles;

	if (newMigrations.length === 0) {
		console.log('No migrations to run!');
		process.exit(0);
	}

	console.log('Running migrations...');

	for (const migration of newMigrations) {
		const signal = importFile(migration.path);
		console.log(migration.path);
		console.log(signal.stderr.toString());
		// If at any point a file import fails, we bail out
		if (!signal.success) process.exit(1);
		const [response] = execSql<[{ id: string; name: string }]>(
			`CREATE migration SET name = "${migration.name}"`,
		);
		if (response.status !== 'OK') {
			console.log("Couldn't register migration to database");
			process.exit(1);
		}
	}
}

if (import.meta.path === Bun.main) {
	runMigrations();
}
