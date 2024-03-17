<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, color = 'primary' } = $props<{
		children: Snippet;
		color: 'primary' | 'secondary';
	}>();
</script>

<span data-color={color}>{@render children()}</span>

<style>
	span {
		border: 0.5px solid var(--black);
		border-radius: 100vw;
		color: var(--black);
		padding-inline: 0.5rem;
		font-size: 0.8rem;
	}
	[data-color='primary'] {
		background-color: var(--orange);
	}
	[data-color='secondary'] {
		/* background-color: #d9d9d9; */
		background-color: var(--black);
		color: white;
	}
</style>
