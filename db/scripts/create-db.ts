import { $ } from 'bun';
import chalk from 'chalk';
import { resolve } from 'path';
import { importFile } from './import';
import { runMigrations } from './migrate';

// Get the location of the schema directory relative to the current file
const schemaDir = resolve(import.meta.dir, '..', 'schema');
// Set up the order that groups of files should be imported in
const subDirImportOrder = ['root', 'scopes', 'tables', 'views', 'events', 'functions'];

// Validate files
console.log(chalk.cyan('Validating files...'));
// const signal = Bun.spawnSync(['surreal', 'validate', `${schemaDir}/**/*.surql`], {
// 	stdio: ['ignore', 'inherit', 'inherit'],
// });
const signal = await $`surreal validate ${schemaDir}/**/*.surql`;
if (signal.exitCode !== 0) {
	process.exit(1);
}

console.log(chalk.green('\nAll files are good to go! Ready to import!'));

// Import each set of files one at a time
const glob = new Bun.Glob('./**/*.surql');
for (const subDir of subDirImportOrder) {
	// Get all the surql files in the directory to be imported
	const surqlFiles = Array.from(glob.scanSync({ absolute: true, cwd: resolve(schemaDir, subDir) }));
	if (surqlFiles.length === 0) {
		continue;
	}

	console.log(chalk.cyan(`\nImporting ${subDir}...`));
	// This allows all files in a directory to be imported simultaneously
	// but will wait for the directory to finish before moving onto the next one
	await Promise.all(
		surqlFiles.map(
			(file) =>
				new Promise<void>(async (resolve) => {
					const signal = await importFile(file);
					// If at any point a file import fails, we bail out
					if (signal.exitCode !== 0) process.exit(1);
					resolve();
				}),
		),
	);
}

console.log(chalk.green('\nFile import complete!\n'));

await runMigrations();
