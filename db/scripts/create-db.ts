import { resolve } from 'path';
import { importFile } from './import';
import { runMigrations } from './migrate';

// Get the location of the schema directory relative to the current file
const schemaDir = resolve(import.meta.dir, '..', 'schema');
// Set up the order that groups of files should be imported in
const subDirImportOrder = ['root', 'scopes', 'tables', 'edges', 'views', 'events', 'functions'];

// Validate files
console.log('Validating files...');
const signal = Bun.spawnSync(['surreal', 'validate', `${schemaDir}/**/*.surql`], {
	stdio: ['ignore', 'inherit', 'inherit'],
});
if (signal.exitCode !== 0) {
	process.exit(1);
}

console.log('\nAll files are good to go! Ready to import!');

// Import each set of files one at a time
const glob = new Bun.Glob('./**/*.surql');
for (const subDir of subDirImportOrder) {
	// Get all the surql files in the directory to be imported
	const surqlFiles = Array.from(glob.scanSync({ absolute: true, cwd: resolve(schemaDir, subDir) }));
	if (surqlFiles.length === 0) {
		continue;
	}

	console.log(`\nImporting ${subDir}...`);
	// This allows all files in a directory to be imported simultaneously
	// but will wait for the directory to finish before moving onto the next one
	await Promise.all(
		surqlFiles.map(
			(file) =>
				new Promise<void>((resolve) => {
					const signal = importFile(file);
					console.log(file);
					console.log(signal.stderr.toString());
					// If at any point a file import fails, we bail out
					if (!signal.success) process.exit(1);
					resolve();
				}),
		),
	);
}

console.log('\nFile import complete!\n');

runMigrations();
