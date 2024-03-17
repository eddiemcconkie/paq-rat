<script lang="ts">
	import logo from '$lib/assets/logo-square-black-no-brackets.svg';
	import logoColor from '$lib/assets/logo-square-color.svg';
	import QRCodeStyling from 'qr-code-styling';
	import type { Action } from 'svelte/action';

	const {
		url,
		color = false,
		canvas = false,
	} = $props<{ url: string; color?: boolean; canvas?: boolean }>();

	const qrcode: Action<HTMLElement, string> = (node, url) => {
		const qr = new QRCodeStyling({
			data: url,
			width: 400,
			height: 400,
			type: 'canvas',
			// type: canvas ? 'canvas' : 'svg',
			cornersSquareOptions: {
				type: 'extra-rounded',
				color: color ? 'var(--orange)' : undefined,
			},
			dotsOptions: {
				type: 'rounded',
				color: 'var(--black)',
			},
			cornersDotOptions: {
				color: 'var(--black)',
			},
			image: color ? logoColor : logo,
		});

		qr.append(node);
	};
</script>

<div use:qrcode={url}></div>

<style>
	div > :global(:is(canvas, svg)) {
		width: 100%;
		display: block;
	}
</style>
