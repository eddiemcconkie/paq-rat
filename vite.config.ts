import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
// import { ChildProcess, spawn } from 'child_process';
import { startSurreal } from './db/scripts/start';
import type { Subprocess } from 'bun';

export default defineConfig({
	plugins: [surrealPlugin(), sveltekit()],
});

function surrealPlugin(): Plugin {
	let surrealProcess: Subprocess;

	return {
		name: 'start surrealdb',
		configureServer({ config: { command } }) {
			if (command !== 'serve') return;

			surrealProcess = startSurreal();
		},
		buildEnd() {
			surrealProcess.kill();
		},
	};
}
