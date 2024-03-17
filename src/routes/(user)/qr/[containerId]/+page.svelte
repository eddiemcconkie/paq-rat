<script lang="ts">
	import { beforeNavigate, invalidate } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import Icon from '$lib/components/icon.svelte';
	import ScrollArea from '$lib/components/scroll-area.svelte';
	import Select from '$lib/components/select.svelte';
	import VisibilityIcon from '$lib/components/visibility-icon.svelte';
	import { getDbContext } from '$lib/context/db.svelte.js';
	import { explicitEffect } from '$lib/reactivity/explicit-effect.svelte.js';
	import { surql } from '$lib/surql';
	import { getIdDisplay, getVisibilityDisplay } from '$lib/utils/display.js';
	import { roles } from '$lib/validators/role.js';
	import { tick } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { GROUP_CONTAINER_LIST } from '../../depends.js';
	import { getContainerTypeIdeas, getLabelIdeas, getLocationIdeas } from './ideas.js';

	const { data } = $props();

	let { id, label, type, location, contents, visibility } = $state({
		...data.container,
		contents: [...data.container.contents, ''],
	});

	let saveState = $state<'saved' | 'dirty'>('saved');
	const contentInputs = $state<HTMLInputElement[]>([]);

	const visibilityLocked = $derived(!data.selectedGroup.isOwn);

	// 	// Reference all fields so that if any of them change the state gets marked dirty.
	// 	// We have to spread contents so that the effect triggers when individual array items change.
	explicitEffect(
		() => (saveState = 'dirty'),
		() => [id, label, type, location, ...contents, visibility],
	);
	$effect(function startWithSaved() {
		saveState = 'saved';
	});

	beforeNavigate((navigation) => {
		if (saveState === 'dirty' && navigation.willUnload) {
			navigation.cancel();
		}
	});
	$effect(
		() =>
			function autosaveOnDestroy() {
				save().then(() => invalidate(GROUP_CONTAINER_LIST));
			},
	);

	const visibilitySelectOptions = roles.map((role) => ({
		value: role,
		label: getVisibilityDisplay(role),
	}));

	const dbPromise = getDbContext();

	async function save() {
		if (saveState !== 'dirty') {
			return;
		}
		const containerData = {
			label: label.trim(),
			type: type.trim(),
			location: location.trim(),
			contents: contents.map((c) => c.trim()).filter((c) => c.length > 0),
		};

		// const query = surql`UPDATE type::thing('container', ${id}) MERGE ${containerData}`;
		const query = surql`
			UPDATE type::thing('container', ${id}) SET
				label = ${label.trim()},
				type = ${type.trim()},
				location = ${location.trim()},
				contents = ${contents.map((c) => c.trim())},
				${visibilityLocked ? surql`` : surql`visibility = type::thing('role', ${visibility})`}
		`;
		await (await dbPromise).query(query);

		saveState = 'saved';
	}

	type KeydownEvent = Parameters<NonNullable<HTMLInputAttributes['onkeydown']>>[0];
	function onKeydown(e: KeydownEvent, i: number) {
		if (e.key === 'Enter') {
			// Split the current input onto the next line
			const { selectionStart, selectionEnd } = e.currentTarget;
			if (selectionStart !== null && selectionStart === selectionEnd) {
				e.preventDefault();
				const beforeSelection = contents[i].slice(0, selectionStart);
				const afterSelection = contents[i].slice(selectionStart);
				contents[i] = beforeSelection;
				contents.splice(i + 1, 0, afterSelection);
				tick().then(() => {
					// Focus the new input and move the cursor to the start
					const nextInput = contentInputs[i + 1];
					nextInput.focus();
					nextInput.selectionStart = 0;
					nextInput.selectionEnd = 0;
				});
			}
		} else if (e.key === 'Backspace' && i > 0 && e.currentTarget.selectionStart === 0) {
			// If the cursor is at the start of the input, combine with the previous input
			e.preventDefault();
			const prevInputLength = contents[i - 1].length;
			contents[i - 1] += contents[i];
			contents.splice(i, 1);
			tick().then(() => {
				// Focus the previous input and move the cursor to the end of the previous input
				const prevInput = contentInputs[i - 1];
				prevInput.focus();
				prevInput.selectionStart = prevInputLength;
				prevInput.selectionEnd = prevInputLength;
			});
		} else if (e.key === 'ArrowUp' && i > 0) {
			// Focus the previous input
			e.preventDefault();
			tick().then(() => {
				// Move the cursor to the end of the previous input
				const prevInput = contentInputs[i - 1];
				const prevInputLength = contents[i - 1].length;
				prevInput.focus();
				prevInput.selectionStart = prevInputLength;
				prevInput.selectionEnd = prevInputLength;
			});
		} else if (e.key === 'ArrowDown' && i < contents.length - 1) {
			// Focus the next input
			e.preventDefault();
			tick().then(() => {
				// Move the cursor to the end of the next input
				const nextInput = contentInputs[i + 1];
				const nextInputLength = contents[i + 1].length;
				nextInput.focus();
				nextInput.selectionStart = nextInputLength;
				nextInput.selectionEnd = nextInputLength;
			});
		}
	}
</script>

<div class="surface-primary p-2xs full-height">
	<div class="page__layout | card on-primary with-shadow | theme-light surface-0 full-height">
		<ScrollArea class="p-xs flex flex-column gap-s">
			<div class="step--1 flex justify-space-between">
				<strong class="page__qrcode-id | color-blue">
					<Icon class="i-lucide:qr-code | step-0" />
					<span class="color-black-2">{getIdDisplay(id)}</span>
				</strong>
				{#if visibilityLocked}
					<span>
						<span>{getVisibilityDisplay(visibility)}</span>
						<VisibilityIcon level={visibility} />
					</span>
				{:else}
					<Select options={visibilitySelectOptions} bind:value={visibility}>
						{#snippet icon(value)}
							<VisibilityIcon level={value} />
						{/snippet}
					</Select>
				{/if}
			</div>

			<label>
				<div class="page__label">
					<Icon class="i-lucide:pencil-line" />
					<span class="input-label">Label</span>
				</div>
				<input
					type="text"
					bind:value={label}
					autocomplete="off"
					class="full-width"
					placeholder={getLabelIdeas()}
				/>
			</label>

			<label>
				<div class="page__label">
					<Icon class="i-lucide:layout-grid" />
					<span class="input-label">Container type</span>
				</div>
				<input
					type="text"
					bind:value={type}
					autocomplete="off"
					class="full-width"
					placeholder={getContainerTypeIdeas()}
				/>
			</label>

			<label>
				<div class="page__label">
					<Icon class="i-lucide:map-pin" />
					<span class="input-label">Location</span>
				</div>
				<!-- <span class="input-label pl-xs">Location</span> -->
				<input
					type="text"
					bind:value={location}
					autocomplete="off"
					class="full-width"
					placeholder={getLocationIdeas()}
				/>
			</label>

			<label>
				<div class="page__label">
					<Icon class="i-lucide:container" />
					<span class="input-label">Contents</span>
				</div>
				<ul role="list">
					{#each contents as item, i}
						<li class="pile">
							<input
								type="text"
								class="full-width"
								bind:this={contentInputs[i]}
								bind:value={contents[i]}
								onkeydown={(e) => onKeydown(e, i)}
							/>
						</li>
					{/each}
				</ul>
			</label>
		</ScrollArea>

		<footer class="p-xs">
			<Button href="/" variant="secondary" class="full-width step-0">
				<Icon class="i-lucide:arrow-left-circle" />
				<span>Save and go back</span>
			</Button>
		</footer>
	</div>
</div>

<!-- </div> -->

<style>
	.page__layout {
		display: grid;
		grid-template-rows: 1fr auto;
		height: 100%;
	}

	ul {
		--uno: bg-lighter-blue radius-2xs py-2xs;
		overflow: clip;
	}
	ul input {
		--uno: radius-0 py-3xs;
	}

	input {
		background-color: var(--lighter-blue);
		padding-inline: calc(var(--space-xs) + var(--space-3xs));
	}
	input:focus-visible {
		background-color: var(--light-blue);
	}

	label {
		display: block;
	}
	.page__label {
		--uno: 'mb-3xs flex align-center gap-3xs';

		> :global([data-icon]) {
			color: var(--blue);
		}
	}
</style>
