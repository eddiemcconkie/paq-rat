import { $ } from 'bun';

await $`surreal sql -e $PUBLIC_SURREAL_HOST --ns $PUBLIC_SURREAL_NS --db $PUBLIC_SURREAL_DB --pretty`.env(
	Bun.env as Record<string, string>,
);
