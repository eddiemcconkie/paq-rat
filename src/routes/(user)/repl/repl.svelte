<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { type DB } from '$lib/surql';
	import { useStoredQueries } from './stored-queries.svelte';

	const { db } = $props<{ db: DB }>();

	const storedQueries = useStoredQueries();
	let query = $state<ReturnType<DB['query']>>();

	let form = $state<HTMLFormElement>();
</script>

<h1 class="p-xs">REPL</h1>

<form
	bind:this={form}
	onsubmit={(e) => {
		e.preventDefault();
		query = db.query_raw(storedQueries.current);
		storedQueries.pushHistory();
	}}
>
	<textarea
		class="p-xs"
		bind:value={storedQueries.current}
		cols="50"
		rows="10"
		onkeydown={(e) => {
			if (e.key === 'Enter' && e.metaKey) {
				form?.requestSubmit();
			}
		}}
	/>
	<div class="px-xs">
		<Button type="submit" variant="primary">Submit (Cmd ⌘ + Enter)</Button>
		<Button
			type="button"
			onclick={() => {
				storedQueries.current = '';
			}}
		>
			Clear
		</Button>
	</div>
</form>

{#await query}
	Querying...
{:then result}
	<div class="result | pt-s">
		<h2 class="px-xs">Result</h2>
		<pre class="p-xs">{JSON.stringify(result, null, 2)}</pre>
	</div>
{:catch error}
	{error}
{/await}

<div class="px-xs pt-s flex align-center gap-s">
	<h2>History</h2>
	<Button
		onclick={() => {
			storedQueries.clearHistory();
		}}
	>
		Clear history
	</Button>
</div>
<ul role="list">
	{#each storedQueries.history as item, i}
		<li>
			<pre>{item}</pre>
			<div>
				<Button
					onclick={() => {
						storedQueries.setFromHistory(i);
					}}
					variant="secondary"
				>
					Rerun
				</Button>
				<Button
					onclick={() => {
						storedQueries.deleteHistory(i);
					}}
				>
					Delete
				</Button>
			</div>
		</li>
	{/each}
</ul>

<style>
	textarea {
		font-family: monospace;
		resize: none;
		border-inline: none;
	}
	textarea,
	pre {
		text-wrap: wrap;
		--uno: step--2;
		width: 100%;
	}
	.result pre {
		border-block: 0.5px solid var(--black);
		max-height: 300px;
	}
	.result:has(pre:empty) {
		display: none;
	}
	ul {
		/* list-style-type: none; */
		padding: 0;
	}
	li {
		/* padding-block: 0.2rem 0.5rem; */
		--uno: p-xs;
		border-block-start: 0.5px solid #333;
	}
</style>
