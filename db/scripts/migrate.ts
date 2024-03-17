import { $ } from 'bun';
import chalk from 'chalk';
import { resolve } from 'path';
import { execSql } from './execute-sql';
import { importFile } from './import';

export async function runMigrations() {
	const [finishedMigrations] = await execSql<[string[]]>(
		'SELECT VALUE name FROM migration ORDER BY name ASC',
	);
	if (finishedMigrations.status !== 'OK') {
		console.log(chalk.red("Couldn't get migrations"));
		process.exit(1);
	}

	const latestMigration = finishedMigrations.result.at(-1);

	const migrationDir = resolve(import.meta.dir, '..', 'schema', 'migrations');
	// Create migration directory if it doesn't exist
	await $`mkdir ${migrationDir}`.quiet();

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
		console.log(chalk.green('No migrations to run!'));
		process.exit(0);
	}

	console.log(chalk.cyan('Running migrations...'));

	for (const migration of newMigrations) {
		const signal = await importFile(migration.path);
		// If at any point a file import fails, we bail out
		if (signal.exitCode !== 0) {
			process.exit(1);
		}

		const [response] = await execSql<[{ id: string; name: string }]>(
			`CREATE migration SET name = "${migration.name}"`,
		);
		if (response.status !== 'OK') {
			console.log(chalk.red("Couldn't register migration to database"));
			process.exit(1);
		}
	}

	console.log(chalk.green('Migrations complete!'));
}

if (import.meta.path === Bun.main) {
	await runMigrations();
}
