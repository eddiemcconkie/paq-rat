<script lang="ts">
	const { data } = $props();
</script>

{#if data.invite.status === 'invited'}
	<div>
		<img src={data.invite.owner.picture} alt="" />
		<p>{data.invite.owner.givenName} is inviting you to join their group as a {data.invite.role}</p>
	</div>
	<form method="post" action="?/acceptInvite">
		<button type="submit"> Accept invite </button>
	</form>
{:else if data.invite.status === 'expired'}
	<p>Invite has expired</p>
{/if}
