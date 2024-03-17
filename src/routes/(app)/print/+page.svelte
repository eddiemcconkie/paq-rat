<script lang="ts">
	import Alert from '$lib/components/alert.svelte';
	import Button from '$lib/components/button.svelte';
	import Icon from '$lib/components/icon.svelte';
	import Qrcode from '$lib/components/qrcode.svelte';
	import { getIdDisplay } from '$lib/utils/display';

	function generateCodes(n: number) {
		return Array.from({ length: n }).map(() => {
			const uuid = crypto.randomUUID();
			const url = new URL(`qr/${uuid}`, location.origin).toString();
			return { uuid, url };
		});
	}

	let codes = $state(generateCodes(25));
	function onclick() {
		window.print();
		codes = generateCodes(25);
	}
	$inspect(codes);
</script>

<main class="no-print | flow p-xs">
	<p>Press the button below to print off a sheet of 25 labels.</p>
	<Alert>
		Make sure you only print out one copy of the page, otherwise you'll get duplicate labels. If you
		need more than 25 labels, you should print them off one at a time.
	</Alert>
	<p>
		After printing off your labels, slap one on a container and scan the QR code to assign it to a
		group.
	</p>
	<Button {onclick} variant="primary" class="full-width step-0">
		<Icon class="i-lucide:printer" />
		<span>Print labels</span>
	</Button>
</main>

<div class="print">
	{#each codes as code}
		<div class="print__code">
			<Qrcode url={code.url} canvas />
			<div class="print__id"><strong>{getIdDisplay(code.uuid)}</strong></div>
			<div class="print__label"></div>
		</div>
	{/each}
</div>

<style>
	@media print {
		.no-print {
			display: none;
		}
		.print {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			border: 1px dashed var(--black);
			background-color: var(--black);
		}
		.print__code {
			background-color: white;
			border: 1px dashed var(--black);
			padding: 0.3cm;
		}
		.print__label {
			margin-top: 0.3cm;
			border-block: 1px solid var(--black);
			height: 0.5cm;
		}
	}
	@media not print {
		.print {
			display: none;
		}
	}
	.print__id {
		font-size: 10px;
	}
</style>
