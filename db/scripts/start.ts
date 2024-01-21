import { resolve } from 'path';
// import { spawn } from 'child_process';

export function startSurreal() {
	return Bun.spawn([
		'surreal',
		'start',
		'--auth',
		'--strict',
		'--no-banner',
		`file:${resolve(import.meta.dir, '..', '..', 'data')}`,
	]);
}

if (import.meta.path === Bun.main) {
	startSurreal();
}
