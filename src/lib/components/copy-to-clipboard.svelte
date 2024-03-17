<script lang="ts">
	const { text } = $props<{ text: string }>();
	let copied = $state(false);

	let timeout: NodeJS.Timeout;
	$effect(function resetCopiedMessage() {
		if (copied) {
			console.log('setting timeout');
			timeout = setTimeout(() => {
				copied = false;
			}, 4000);
		}

		return () => {
			if (copied) {
				clearTimeout(timeout);
				console.log('clearing timeout');
			}
		};
	});
</script>

<button
	onclick={() => {
		navigator.clipboard.writeText(text);
		copied = true;
	}}
	disabled={copied}
>
	{#if copied}
		Copied to Clipboard!
	{:else}
		Copy invite to clipboard
	{/if}
</button>
