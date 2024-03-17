import { $ } from 'bun';

export async function importFile(file: string) {
	const { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } = Bun.env;

	const output =
		await $`surreal import --endpoint ${PUBLIC_SURREAL_HOST} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB} ${file}`.quiet();
	console.log(file);
	console.log(output.stderr.toString());
	return output;
}
