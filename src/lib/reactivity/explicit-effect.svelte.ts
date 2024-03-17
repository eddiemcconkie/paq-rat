import { untrack } from 'svelte';

export function explicitEffect(fn: () => void, depsFn: () => any[]) {
	$effect(() => {
		depsFn();
		untrack(fn);
	});
}
