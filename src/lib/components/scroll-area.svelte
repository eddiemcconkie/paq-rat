<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, ...props } = $props<{ children: Snippet; class?: string }>();

	// const {} = createScrollArea({
	// 	type: 'scroll',
	// });
</script>

<div class={props.class}>
	{@render children()}
</div>

<style>
	div {
		height: 100%;
		overflow-y: auto;
	}
</style>
