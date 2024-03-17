import { $ } from 'bun';

export async function importFile(file: string) {
	const output =
		await $`surreal import --endpoint $PUBLIC_SURREAL_HOST --ns $PUBLIC_SURREAL_NS --db $PUBLIC_SURREAL_DB ${file}`
			.env(Bun.env as Record<string, string>)
			.quiet();
	console.log(file);
	console.log(output.stderr.toString());
	return output;
}
