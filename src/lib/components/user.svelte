<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	const { signedIn, signedOut } = $props<{
		signedIn: Snippet<[user: NonNullable<App.PageData['user']>]>;
		signedOut?: Snippet;
	}>();
</script>

{#if $page.data.user}
	{@render signedIn($page.data.user)}
{:else if signedOut}
	{@render signedOut()}
{/if}
