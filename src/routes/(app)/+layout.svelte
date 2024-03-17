<script lang="ts">
	import '$lib/styles/global.css';
	import 'virtual:uno.css';

	const { children } = $props();
</script>

<main>{@render children()}</main>

<style>
	main {
		overflow-y: auto;
	}
</style>
