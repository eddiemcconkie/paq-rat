import type { Container } from '$lib/validators/container';
import { chain } from 'lodash-es';

export type useSearch = {
	q: string;
	sort:
		| {
				by: 'visibility';
				dir: 'asc' | 'desc';
		  }
		| undefined;
	tag: string | undefined;
};

function filterAndSortContainers(search: useSearch, containers: Container[]) {
	const { q, sort } = search;
	let sorted = chain(containers);
	if (sort) {
		sorted = sorted.orderBy((container) => container[sort.by], [sort.dir]);
	}
	if (q.trim().length > 0) {
		sorted = sorted.filter((container) => container.label.toLowerCase().includes(q.toLowerCase()));
	}
	return sorted.value();
}

export function useSearch(containers: Container[]) {
	const search = $state<useSearch>({
		q: '',
		sort: undefined,
		tag: undefined,
	});

	const searchedContainers = $derived(filterAndSortContainers(search, containers));

	return { search, containers: searchedContainers };
}
