<!-- @component
	**Renders either a button or an anchor tag, depending on whether you pass an href.**
	
	@usage
	Button button:
	```svelte
	<Button type="submit" onclick>Button button</Button>
	```
	Anchor button:
	```svelte
	<Button href="/about">Anchor button</Button>
	```
	Button with just an icon (will be styled differently with even padding all around):
	```svelte
	<Button>
		<Icon class="i-lucide:plus" />
	</Button>
	```
	Button with icon and text (text should be wrapped in a `<span>` so as not to conflict
	with the icon-only styles since it checks for :has(> [data-icon]:only-child) which
	would match an icon and a text node):
	```svelte
	<Button>
		<Icon class="i-lucide:plus" />
		<span>Button with icon and text</span>
	</Button>
	```
 -->

<script lang="ts">
	import type { Builder } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type SharedAttributes = HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>;
	type AnchorAttributes = Omit<HTMLAnchorAttributes, keyof SharedAttributes>;
	type ButtonAttributes = Omit<HTMLButtonAttributes, keyof SharedAttributes>;
	type DiscriminatedAttributes =
		| ({
				href: string;
		  } & AnchorAttributes)
		| ({
				href?: undefined | null;
		  } & ButtonAttributes);

	type ButtonProps = SharedAttributes &
		DiscriminatedAttributes & {
			children: Snippet;
			variant?: 'primary' | 'secondary' | 'text' | 'outlined';
			builder?: Builder;
		};

	const undefinedBuilder: Builder = {
		action: () => {},
	};

	const {
		children,
		variant = 'text',
		builder = undefinedBuilder,
		...props
	} = $props<ButtonProps>();
</script>

<svelte:element
	this={props.href ? 'a' : 'button'}
	{...props}
	data-button
	data-button-variant={variant}
	use:builder.action
	{...builder}
>
	{@render children()}
</svelte:element>

<style>
	[data-button],
	[data-button-variant='text'] {
		--uno: gap-2xs;
		display: inline-flex;
		align-items: center;

		transition: all 200ms;
		border: 0.5px solid transparent;
		border-radius: 0.5em;
		background-color: transparent;
		padding: 0.3em 0.7em;
		color: light-dark(var(--black), white);
		text-decoration-line: none;

		&:hover {
			background-color: color-mix(in oklab, black 20%, transparent);
		}
		&:active {
			background-color: color-mix(in oklab, var(--orange) 20%, transparent);
		}
		/* If the only child is an icon, make it square */
		&:has(> [data-icon]:only-child) {
			padding: 0.3em;
		}
	}
	[data-button-variant='primary'] {
		/* background-color: var(--orange); */
		background: linear-gradient(45deg, var(--orange) 0%, var(--yellow) 100%);
		color: var(--black);
		&:hover {
			background-color: color-mix(in oklab, var(--orange) 80%, white);
		}
		&:active {
			background-color: color-mix(in oklab, var(--orange) 80%, var(--black));
		}
	}
	[data-button-variant='secondary'] {
		background-color: var(--light-blue);
		color: var(--black);
		&:hover {
			background-color: color-mix(in oklab, var(--light-blue) 80%, white);
		}
		&:active {
			background-color: color-mix(in oklab, var(--light-blue) 80%, transparent);
		}
	}
	[data-button-variant='outlined'] {
		border: 0.5px solid var(--black);
		color: var(--black);
		&:hover {
			background-color: color-mix(in oklab, var(--black) 20%, transparent);
		}
		&:active {
			background-color: color-mix(in oklab, var(--black) 20%, transparent);
		}
	}
</style>
