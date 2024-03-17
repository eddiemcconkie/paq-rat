<script lang="ts">
	import type { Snippet } from 'svelte';

	import Icon from './icon.svelte';

	const { children } = $props<{ children: Snippet }>();
</script>

<div class="alert | step--1 p-2xs bg-orange/30 radius-3xs">
	<Icon class="i-lucide:alert-circle mt-3xs" />
	<!-- <div> -->
	{@render children()}
	<!-- </div> -->
</div>

<style>
	.alert {
		display: grid;
		grid-template-columns: auto 1fr;
		border-left: 4px solid var(--orange);
		--uno: gap-2xs;
	}
</style>
