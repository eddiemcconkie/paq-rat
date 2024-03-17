<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import QrScanner from 'qr-scanner';
	import type { Action } from 'svelte/action';

	const scanner: Action<HTMLVideoElement> = (video) => {
		const scanner = new QrScanner(
			video,
			function onDecode(result) {
				if (result.data.startsWith(location.origin)) {
					scanner.stop();
					goto(result.data, { replaceState: true }).then(invalidateAll).catch(scanner.start);
				}
			},
			{
				highlightCodeOutline: true,
				highlightScanRegion: true,
				onDecodeError(error) {},
			},
		);
		scanner.start();

		return {
			destroy() {
				scanner.stop();
			},
		};
	};
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video use:scanner />

<style>
	video {
		width: 100%;
		height: 100%;
	}
</style>
