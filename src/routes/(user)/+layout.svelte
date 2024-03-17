<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LogoWide from '$lib/assets/logo-wide.svelte';
	import Avatar from '$lib/components/avatar.svelte';
	import Button from '$lib/components/button.svelte';
	import Icon from '$lib/components/icon.svelte';
	import Pill from '$lib/components/pill.svelte';
	import { createDbContext } from '$lib/context/db.svelte.js';
	import { circOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import '$lib/styles/global.css';
	import 'virtual:uno.css';

	const { data, children } = $props();

	let menuOpen = $state(false);

	const { closeConnection } = createDbContext(data.surrealToken);
	$effect(() => () => closeConnection());

	afterNavigate(() => {
		menuOpen = false;
	});
</script>

<main>{@render children()}</main>

{#if menuOpen}
	<nav class="theme-dark surface-0" transition:slide|global={{ duration: 200, easing: circOut }}>
		<ul role="list">
			<!-- <li>
				<Button href="/account" class="full-width">
					<Avatar user={data.user} size="inline" />
					Account
				</Button>
			</li> -->
			<!-- <li><a href="/welcome">Welcome</a></li> -->
			<li>
				<Button href="/invite" class="full-width">
					<Icon class="i-lucide:user-plus" />
					<span>Invite</span>
				</Button>
			</li>
			<li>
				<Button href="/repl" class="full-width">
					<Icon class="i-lucide:terminal" />
					<span>REPL</span>
				</Button>
			</li>
			<li>
				<Button href="/print" class="full-width">
					<Icon class="i-lucide:printer" />
					<span>Print labels</span>
				</Button>
			</li>
		</ul>
		<hr />
		<form method="post">
			<div class="step--2 px-2xs py-3xs">
				<strong>Switch groups</strong>
				<Icon class="i-lucide:arrow-right-left" />
			</div>
			{#each data.groups ?? [] as group}
				<div>
					<button
						type="submit"
						formaction="/?/setGroup&groupId={group.id}"
						class="page__group-select-button | flex flex-(justify-space-between align-center)"
						class:page__selected-group-button={data.selectedGroup.id === group.id}
					>
						<span class="flex gap-2xs justify-end">
							<Avatar user={group.owner} size="small" />
							<span>{group.owner.givenName}</span>
						</span>
						{#if group.role !== 'owner'}
							<Pill color={group.role === 'family' ? 'primary' : 'secondary'}>
								{group.role}
							</Pill>
						{/if}
					</button>
				</div>
			{/each}
		</form>
		<!-- <hr /> -->
		<!-- <Signout /> -->
	</nav>
{/if}

<div class="theme-dark surface-0">
	{#key data.selectedGroup.id}
		{#await new Promise((resolve) => setTimeout(resolve, 1000))}
			<div class="page__viewing | theme-light surface-0" transition:slide>
				Viewing {data.selectedGroup.owner.givenName}&rsquo;s group
			</div>
		{/await}
	{/key}
	<footer class="theme-dark surface-0 px-xs py-2xs flex justify-space-between">
		<LogoWide />
		<Button href="/scan" variant="primary">
			<Icon class="i-lucide:scan step-4" aria-label="Scan" />
		</Button>
		<Button
			onclick={() => {
				menuOpen = !menuOpen;
			}}
		>
			<span>Menu</span>
			<Icon class="i-lucide:chevron-down" aria-label="Menu" />
		</Button>
	</footer>
</div>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow-y: hidden;
	}
	main {
		flex: 1;
		overflow-y: auto;
	}
	footer {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
	}
	footer > :global(svg) {
		align-self: center;
	}
	footer > :global(:last-child) {
		justify-self: end;
	}
	.page__viewing {
		text-align: center;
	}
	.page__group-select-button {
		border: 0;
		background: transparent;
		padding: 0.5rem;
		/* display: flex; */
		/* align-items: center; */
		/* justify-content: space-between; */
		/* gap: 0.5rem; */
		width: 100%;
	}
	.page__selected-group-button {
		/* background-color: var(--orange); */
		--uno: 'bg-light-blue color-black';
		font-weight: bold;
	}
	hr {
		margin: 0;
		border-width: 0.25px;
	}
</style>
