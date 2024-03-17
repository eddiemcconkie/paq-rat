<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/button.svelte';
	import CopyToClipboard from '$lib/components/copy-to-clipboard.svelte';
	import Qrcode from '$lib/components/qrcode.svelte';
	import type { Invite } from '$lib/validators/invite';

	const invite = $derived<Invite | null>($page.form);
	const link = $derived(invite ? new URL(`invite/${invite.id}`, location.origin).toString() : '');

	const shareData = $derived<ShareData>({
		title: 'PAQ RAT',
		text: `Join ${$page.data.user?.givenName}'s group as a ${invite?.role}`,
		url: link,
	});
	const canShare = $derived(navigator.canShare ? navigator.canShare(shareData) : false);
	// const canShare = $derived(navigator.canShare ? navigator.canShare(shareData) : false);
</script>

{#if invite}
	<p>Have someone scan this code for them to join as a {invite.role}</p>
	<Qrcode url={link} color />
	{#if canShare}
		<button
			onclick={() => {
				navigator.share(shareData);
			}}
		>
			Share
		</button>
	{:else}
		<p>Or send them a link!</p>
		<p>{link}</p>
		<CopyToClipboard text={link} />
	{/if}
{:else}
	<p>
		Invite family to join your group with full access to your stuff, or invite friends to help with
		moving or something with limited access.
	</p>
	<form method="POST" use:enhance>
		Create invite link for:
		<Button type="submit" formaction="/invite?/create&role=family" variant="primary">Family</Button>
		<Button type="submit" formaction="/invite?/create&role=friend" variant="primary">
			Friends
		</Button>
	</form>
{/if}
