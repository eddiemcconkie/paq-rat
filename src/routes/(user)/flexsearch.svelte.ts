import { getVisibilityDisplay } from '$lib/utils/display';
import type { Container } from '$lib/validators/container';
import FlexSearch from 'flexsearch';

interface ContainerDoc extends Container {
	visibilityDisplay: string;
}

type NonIndexedField = 'id' | 'visibility' | 'created' | 'updated';
type SearchResult = {
	field: Exclude<keyof ContainerDoc, NonIndexedField>;
	result: string[];
};

type ContainerSearchResult = {
	[Key in keyof ContainerDoc]: Key extends NonIndexedField
		? ContainerDoc[Key]
		: {
				matched: boolean;
				value: ContainerDoc[Key];
			};
};

const MIN_LENGTH = 1;

function markValue(query: string, value: string | string[]): string | string[] {
	const regex = new RegExp(query, 'i');

	if (typeof value === 'string') return value.replace(regex, (match) => `<mark>${match}</mark>`);

	return value
		.filter((v) => regex.test(v))
		.map((v) => v.replace(regex, (match) => `<mark>${match}</mark>`));
}

function processResults(
	query: string,
	data: ContainerDoc[],
	resultSets: FlexSearch.SimpleDocumentSearchResultSetUnit[],
) {
	const allIds = resultSets.flatMap((resultSet) => resultSet.result) as string[];

	const containerSearchResultMap = new Map<string, ContainerSearchResult>(
		data
			.filter((container) => query.length < MIN_LENGTH || allIds.includes(container.id))
			.map((container) => [
				container.id,
				{
					id: container.id,
					label: { matched: false, value: container.label },
					type: { matched: false, value: container.type },
					location: { matched: false, value: container.location },
					contents: { matched: false, value: [...container.contents] },
					visibility: container.visibility,
					visibilityDisplay: { matched: false, value: container.visibilityDisplay },
					created: container.created,
					updated: container.updated,
				},
			]),
	);

	for (const { field, result } of resultSets as SearchResult[]) {
		for (const id of result) {
			const container = containerSearchResultMap.get(id)!;
			container[field] = {
				matched: true,
				// @ts-ignore
				value: markValue(query, container[field].value),
			};
		}
	}
	return [...containerSearchResultMap.values()];
}

function addDocFields(data: Container[]) {
	return data.map((container) => ({
		...container,
		visibilityDisplay: getVisibilityDisplay(container.visibility),
	}));
}

export function createSearch(init: Container[]) {
	const index = new FlexSearch.Document<ContainerDoc>({
		document: {
			id: 'id',
			index: ['name', 'description', 'location', 'tags', 'contents', 'visibilityDisplay'],
		},
		tokenize: 'full',
		// @ts-ignore
		minlength: MIN_LENGTH,
	});

	let query = $state('');
	let data = $state<ContainerDoc[]>(addDocFields(init));

	const searchResults = $derived.by(() => {
		const match = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const results = index.search({ query: match });
		return processResults(match, data, results);
	});

	return {
		get query() {
			return query;
		},
		set query(value) {
			query = value;
		},
		get results() {
			return searchResults;
		},
		index(newData: Container[]) {
			const docs = addDocFields(newData);
			for (const doc of docs) {
				/**
				 * TODO: Remove deleted containers
				 * Use a Set to find the difference between old and new ids
				 * and remove the difference from the index
				 */
				index.add(doc);
			}
			data = docs;
		},
	};
}
