import { resolve } from 'path';

export function startSurreal(path: string) {
	return Bun.spawn(['surreal', 'start', '--auth', '--strict', '--no-banner', `file:${path}`]);
}

if (import.meta.path === Bun?.main) {
	startSurreal(resolve(import.meta.dir, '..', 'data'));
}
