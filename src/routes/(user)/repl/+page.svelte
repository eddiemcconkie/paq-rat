<script lang="ts">
	import { getDbContext } from '$lib/context/db.svelte';
	import Repl from './repl.svelte';

	const { data } = $props();

	// const dbPromise = $derived(
	// 	data.surrealToken
	// 		? connect({ type: 'token', token: data.surrealToken }).then(({ db }) => db)
	// 		: Promise.reject(),
	// );
	const dbPromise = getDbContext();
</script>

{#await dbPromise}
	Connecting...
{:then db}
	<Repl {db} />
{:catch error}
	Could not connect: {error}
{/await}
