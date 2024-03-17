<script lang="ts">
	import type { User } from '$lib/validators/user';

	const sizeMap = {
		small: '30px',
		medium: '60px',
		large: '120px',
		inline: '1em',
	};
	type Size = keyof typeof sizeMap;

	const { user, size } = $props<{ user: User | null; size: Size }>();

	const initials = $derived([user?.givenName?.at(0), user?.familyName?.at(0)].join(''));
</script>

{#if user}
	<img src={user.picture} style:width={sizeMap[size]} alt="" />
{:else}
	<div>{initials}</div>
{/if}

<style>
	img,
	div {
		display: grid;
		place-items: center;
		border: 50% solid var(--light-blue);
		/* border: 50% solid var(--light-blue); */
		border-radius: var(--space-3xs);
		/* background-color: var(--light-blue); */
	}
</style>
