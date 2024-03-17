import { sveltekit } from '@sveltejs/kit/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		cssMinify: 'lightningcss',
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			drafts: { customMedia: true },
			targets: browserslistToTargets(browserslist('defaults')),
		},
	},
	plugins: [UnoCSS({ extractors: [extractorSvelte()] }), sveltekit()],
	optimizeDeps: {
		exclude: ['bits-ui'],
	},
});
