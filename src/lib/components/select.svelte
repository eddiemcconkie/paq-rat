<script lang="ts" generics="TOption extends Selected<any>">
	import { slide } from 'svelte/transition';

	import { Select, type Selected } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Button from './button.svelte';

	// NoInfer should make this easier once it's supported
	type SelectProps = TOption extends infer Option extends Selected<any>
		? {
				options: TOption[];
				value?: Option['value'];
				icon?: Snippet<[value: Option['value']]>;
			}
		: never;

	let { options, value, icon }: SelectProps = $props();
	const selected = options.find((option) => option.value === value);
</script>

<Select.Root
	items={options}
	{selected}
	onSelectedChange={(selected) => {
		value = selected?.value;
	}}
>
	<Select.Trigger asChild let:builder>
		<Button variant="secondary" {builder}>
			{#if icon}
				{@render icon(value)}
			{/if}
			<Select.Value />
		</Button>
	</Select.Trigger>
	<Select.Content
		class="card with-shadow | p-3xs flex flex-column | unset-width"
		side="bottom"
		sameWidth={false}
		transition={slide}
		transitionConfig={{ duration: 200 }}
	>
		{#each options as option}
			<Select.Item value={option.value} label={option.label} asChild let:builder>
				<Button variant={option.value === value ? 'secondary' : 'text'} {builder}>
					{#if icon}
						{@render icon(option.value)}
					{/if}
					<span>{option.label}</span>
				</Button>
				<!-- <div
					class="select-item"
					class:selected={option.value === value}
					use:builder.action
					{...builder}
				>
					{#if icon}
						{@render icon(option.value)}
					{/if}
					{option.label}
				</div> -->
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

<style>
	/* .select-item {
		--uno: p-3xs pr-xs radius-3xs;
	}
	.selected {
		--uno: bg-light-blue;
	}
	.unset-width {
		min-width: 200px;
	} */
</style>
