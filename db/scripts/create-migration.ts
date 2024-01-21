import { resolve } from 'path';

const date = new Date().toISOString().replace(/[TZ\-\.:]/g, '');

const migrationName = process.argv.at(2);
if (!migrationName) {
	console.log('Enter a name for your migration');
	process.exit(1);
}

const filename = `${date}-${migrationName}.surql`;

const migrationPath = resolve(import.meta.dir, '..', 'schema', 'migrations', filename);
console.log(migrationPath);
Bun.write(migrationPath, '');
Bun.spawnSync(['code', migrationPath]);
