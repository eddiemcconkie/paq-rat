import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

const position: Record<string, string[]> = {
	default: ['block-start', 'block-end', 'inline-start', 'inline-end'],
	x: ['inline-start', 'inline-end'],
	y: ['block-start', 'block-end'],
	t: ['block-start'],
	b: ['block-end'],
	l: ['inline-start'],
	r: ['inline-end'],
};

export default defineConfig({
	presets: [
		presetIcons({
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'text-top',
			},
		}),
	],
	blocklist: ['color-mix(in'],
	rules: [
		// Margin
		[
			/^m([xytblr]?)-(.+)$/,
			([_, pos, space]) => {
				pos ||= 'default';
				if (!position[pos]) return {};
				return Object.fromEntries(
					position[pos].map((p) => [`margin-${p}`, `var(--space-${space})`]),
				);
			},
		],

		// Padding
		[
			/^p([xytblr]?)-(.+)$/,
			([_, pos, space]) => {
				pos ||= 'default';
				if (!position[pos]) return {};
				return Object.fromEntries(
					position[pos].map((p) => [`padding-${p}`, `var(--space-${space})`]),
				);
			},
		],

		// Border radius
		['radius-round', { 'border-radius': '100vw' }],
		['radius-0', { 'border-radius': '0' }],
		[/^radius-(.+)$/, ([_, space]) => ({ 'border-radius': `var(--space-${space})` })],

		// Aspect ratio
		['aspect-square', { 'aspect-ratio': '1 / 1 ' }],
		[/^aspect-(\d+)\/(\d+)$/, ([_, w, h]) => ({ 'aspect-ratio': `${w} / ${h}` })],

		// Font
		[/^step-(\d+|\-\d+)$/, ([_, step]) => ({ 'font-size': `var(--step-${step})` })],
		// [/^weight-(.+)$/, ([_, weight]) => ({ 'font-weight': `var(--weight-${weight})` })],
		[/^weight-(.+)$/, ([_, weight]) => ({ 'font-weight': weight })],

		// Gap
		[/^gap-(.+)$/, ([_, space]) => ({ gap: `var(--space-${space})` })],

		// Color
		// [/^color-(.+)$/, ([_, color]) => ({ color: `var(--${color})` })],
		[/^color-(.+)$/, ([_, color]) => ({ color: `var(--${color})` })],
		[
			/^color-(.+)\/(\d+)$/,
			([_, color, opacity]) => ({
				color: `color-mix(in oklab, var(--${color}) ${opacity}%, transparent)`,
			}),
		],
		[/^bg-(.+)$/, ([_, color]) => ({ 'background-color': `var(--${color})` })],
		[
			/^bg-(.+)\/(\d+)$/,
			([_, color, opacity]) => ({
				'background-color': `color-mix(in oklab, var(--${color}) ${opacity}%, transparent)`,
			}),
		],

		// Flex
		['flex', { display: 'flex' }],
		['flex-column', { 'flex-direction': 'column' }],
		['flex-grow', { flex: '1 1 auto' }],
		[/^flex-shrink-(\d+)$/, ([_, shrink]) => ({ 'flex-shrink': shrink })],

		// Grid
		['grid', { display: 'grid' }],

		// Alignment
		[/justify-(.+)$/, ([_, justify]) => ({ 'justify-content': justify })],
		[/justify-self-(.+)$/, ([_, justify]) => ({ 'justify-self': justify })],
		[/align-(.+)$/, ([_, align]) => ({ 'align-items': align })],
		[/align-self-(.+)$/, ([_, align]) => ({ 'align-self': align })],

		// Width
		['full-width', { width: '100%' }],

		// Border
		// [
		// 	/^border-(dark|light)(?:-([xytblr]))?$/,
		// 	([_, color, pos]) => {
		// 		pos ||= 'default';
		// 		if (!position[pos]) return {};

		// 		return Object.fromEntries([
		// 			...position[pos].flatMap((p) => [
		// 				[`border-${p}-width`, `var(--border-width)`],
		// 				[`border-${p}-color`, `var(--border-color-${color})`],
		// 				[`border-${p}-style`, `solid`],
		// 			]),
		// 		]);
		// 	},
		// ],

		// // Line height
		// [
		// 	/^lh-(\d+(?:\.\d+)?)$/,
		// 	([_, lineHeight]) => ({
		// 		'line-height': lineHeight,
		// 	}),
		// ],

		// Theme
		['theme-dark', { 'color-scheme': 'dark' }],
		['theme-light', { 'color-scheme': 'light' }],
	],
	shortcuts: [['input-label', 'step--2 weight-bold']],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
