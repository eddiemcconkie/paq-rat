<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import ScrollArea from '$lib/components/scroll-area.svelte';
	import VisibilityIcon from '$lib/components/visibility-icon.svelte';
	import { getIdDisplay } from '$lib/utils/display.js';
	import type { Snapshot } from './$types.js';
	import { createSearch } from './flexsearch.svelte.js';

	const { data } = $props();

	const search = createSearch(data.containers);
	$effect(() => {
		search.index(data.containers);
	});

	const searchPlaceholder = $derived(
		data.selectedGroup.isOwn
			? 'Search my stuff...'
			: `Search ${data.selectedGroup.owner.givenName}'s stuff...`,
	);

	export const snapshot: Snapshot<string> = {
		capture: () => search.query,
		restore: (value) => (search.query = value),
	};
</script>

<ScrollArea class="surface-primary">
	<header>
		<!-- <div class="surface-primary p-xs"> -->
		<div class="p-xs">
			<search class="pile align-center">
				<input
					type="text"
					class="flex-grow"
					bind:value={search.query}
					autocomplete="off"
					placeholder={searchPlaceholder}
				/>
				<!-- placeholder="Search..." -->
				<Icon class="i-lucide:package-search step-0 color-black-2/80 justify-self-end mr-xs" />
				<!-- <Icon class="i-lucide:search step-1 justify-self-end mr-2xs" /> -->
			</search>
		</div>
	</header>

	<ul role="list" class="p-xs flex flex-column gap-xs">
		{#each search.results as container (container.id)}
			<li class="theme-light surface-0 radius-2xs px-xs py-2xs">
				<a href="/qr/{container.id}" class="color-black flex flex-column gap-3xs">
					<div class="step--2 flex flex-(justify-space-between align-center)">
						<strong class="color-blue">
							<Icon class="i-lucide:qr-code step--1" />
							<span class="color-black-2">{getIdDisplay(container.id)}</span>
						</strong>
						<!-- <strong class="color-orange">{getIdDisplay(container.id)}</strong> -->
						<span>
							<span>{@html container.visibilityDisplay.value}</span>
							<VisibilityIcon level={container.visibility} class="color-blue step--1" />
						</span>
					</div>

					<div>
						{#if container.label.value.trim() === ''}
							<em style:opacity="0.5">No label</em>
						{:else}
							<strong>{@html container.label.value}</strong>
						{/if}
						{#if container.type.value}
							<span class="step--2">
								— {@html container.type.value}
							</span>
						{/if}
						<hr />
					</div>

					{#if container.location.value}
						<div class="step--2 flex gap-3xs">
							<Icon class="i-lucide:map-pin color-blue step--1 flex-shrink-0" />
							<span>{@html container.location.value}</span>
						</div>
					{/if}

					{#if container.contents.value.length > 0}
						<div class="step--2 flex gap-3xs">
							<Icon class="i-lucide:container color-blue step--1 flex-shrink-0" />
							<div class="page__contents-list">
								{@html container.contents.value.join(', ')}
							</div>
						</div>
					{/if}
				</a>
			</li>
		{/each}
		<!-- {#each { length: 50 } as i}
			<li class="theme-light surface-0 radius-2xs px-xs py-2xs">hey</li>
		{/each} -->
	</ul>
</ScrollArea>

<style>
	li {
		box-shadow:
			0 3px 5px 1px color-mix(in oklab, var(--black) 10%, transparent),
			0 3px 10px color-mix(in oklab, var(--orange) 90%, transparent);
	}
	a {
		text-decoration-line: none;
	}
	a:hover {
		color: var(--black);
	}
	.page__search-bar {
		display: grid;
		grid-template-columns: 1fr auto;
	}
	.page__contents-list {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	hr {
		margin-top: 0;
		border: 0;
		border-top: 2px solid var(--light-blue);
		width: 100%;
	}
</style>
