import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

type SearchParamTypes = {
	string: string;
	'string[]': string[];
	number: number;
	'number[]': number[];
};
type SearchConfigObject = Record<string, keyof SearchParamTypes>;

type Mappers = {
	[Key in keyof SearchParamTypes]: {
		encode: (value: SearchParamTypes[Key]) => string;
		decode: (value: string) => SearchParamTypes[Key];
	};
};
const DELIMITER = '::';
const mappers: Mappers = {
	string: {
		encode: String,
		decode: String,
	},
	'string[]': {
		encode: (value) => value.join(DELIMITER),
		decode: (value) => value.split(DELIMITER),
	},
	number: {
		encode: String,
		decode: Number,
	},
	'number[]': {
		encode: (value) => value.map(String).join(DELIMITER),
		decode: (value) => value.split(DELIMITER).map(Number),
	},
};

type SearchOutput<T extends SearchConfigObject> = {
	[Key in keyof T]?: SearchParamTypes[T[Key]];
} & {};

export function Search<T extends SearchConfigObject>(searchParamTypes: T) {
	const url = get(page).url;
	const searchParams = url.searchParams;
	let search = $state(
		Object.fromEntries(
			Object.entries(searchParamTypes).map(([key, type]) => [
				key,
				searchParams.has(key) ? mappers[type].decode(searchParams.get(key)!) : undefined,
			]),
		) as SearchOutput<T>,
	);

	$effect(() => {
		for (const key in search) {
			if (!search[key]) {
				searchParams.delete(key);
			} else {
				searchParams.set(key, mappers[searchParamTypes[key]].encode(search[key]!));
			}
		}
		// history.replaceState(null, '', url);
		goto(url, { replaceState: true });
		// if (browser) replaceState(url, {});
	});

	return search;
}
