<script lang="ts">
	import type { Role } from '$lib/validators/role';
	import Icon from './icon.svelte';

	const { level, ...props } = $props<{ level: Role; class?: string }>();
</script>

{#if level === 'owner'}
	<Icon class="i-lucide:lock {props.class}" />
{:else if level === 'family'}
	<Icon class="i-lucide:home {props.class}" />
{:else if level === 'friend'}
	<Icon class="i-lucide:users-round {props.class}" />
{/if}
