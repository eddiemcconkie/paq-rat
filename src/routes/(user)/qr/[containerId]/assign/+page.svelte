<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import Button from '$lib/components/button.svelte';
	import { roles, type Role } from '$lib/validators/role.js';

	const { data } = $props();

	const lasUsedVisibility: Role = 'owner';
	let selectedVisibility = $state<Role>(lasUsedVisibility);

	const checkedVisibilities = $derived(
		roles.map((v) => roles.indexOf(selectedVisibility) >= roles.indexOf(v)),
	);
	$inspect(checkedVisibilities);
</script>

<form method="post">
	{#each data.groups as group}
		{@const visibility = group.role === 'owner' ? selectedVisibility : group.role}
		<div class="flex align-center gap-2xs">
			<button type="submit" formaction="?/assign&groupId={group.id}&visibility={visibility}">
				<Avatar user={group.owner} size="medium" />
				<p>{group.owner.givenName}</p>
			</button>
			{#if group.role === 'owner'}
				<div class="flex flex-column">
					{#each roles as role, i}
						<Button
							variant={checkedVisibilities[i] ? 'secondary' : 'outlined'}
							onclick={(e) => {
								e.preventDefault();
								selectedVisibility = role;
							}}
						>
							{role}
						</Button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</form>
