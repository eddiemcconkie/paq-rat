import { PUBLIC_SURREAL_DB, PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS } from '$env/static/public';
import { Surreal } from 'surrealdb.js';
import type { SafeParseReturnType, z } from 'zod';
import { User } from './schema/user';

class SurQL {
	constructor(
		readonly query: string,
		readonly params: Record<string, string>,
	) {}
	private readonly symbol = Symbol();
}

export function surql(strings: TemplateStringsArray, ...args: unknown[]) {
	let query = strings[0] ?? '';
	let params: Record<string, string> = {};
	args.forEach((value, i) => {
		if (value instanceof SurQL) {
			query = query.concat(value.query, strings[i + 1] ?? '');
			params = { ...params, ...value.params };
		} else {
			const id = crypto.randomUUID().replaceAll('-', '').slice(0, 6);
			const paramName = `_${id}`;
			query = query.concat('$', paramName, strings[i + 1] ?? '');
			params[paramName] = JSON.stringify(value);
		}
	});
	return new SurQL(query, params);
}

type RawQueryResult =
	| string
	| number
	| boolean
	| symbol
	| null
	| RawQueryResult[]
	| Record<string | number | symbol, unknown>;

type MapSafeParseReturnTypes<T extends z.ZodTypeAny[]> = T extends [
	infer First extends z.ZodTypeAny,
	...infer Rest extends z.ZodTypeAny[],
]
	? [SafeParseReturnType<z.input<First>, z.output<First>>, MapSafeParseReturnTypes<Rest>]
	: T;

export class DB extends Surreal {
	// @ts-ignore
	async query<T extends RawQueryResult[]>(surql: SurQL): Promise<T> {
		return super.query(surql.query, surql.params);
	}
	async zodQuery<TSchemas extends z.ZodTypeAny[]>(surql: SurQL, ...schemas: TSchemas) {
		let responses = await super.query(surql.query, surql.params);
		console.log(responses);
		if (!Array.isArray(responses)) {
			responses = [responses];
		}
		if (responses.length !== schemas.length) {
			throw new Error('The number of SurQL statements does not match the number of Zod schemas');
		}

		return responses.map((response, i) =>
			schemas[i].safeParse(response),
		) as MapSafeParseReturnTypes<TSchemas>;
	}
}

type Auth =
	| {
			type: 'token';
			token: string;
	  }
	| {
			type: 'sessionId';
			sessionId: string;
	  };

export async function connect(auth: Auth) {
	const db = new DB();
	await db.connect(PUBLIC_SURREAL_HOST, {
		namespace: PUBLIC_SURREAL_NS,
		database: PUBLIC_SURREAL_DB,
	});
	let token = '';
	if (auth.type === 'token') {
		await db.authenticate(auth.token);
		token = auth.token;
	} else if (auth.type === 'sessionId') {
		token = await db.signin({ scope: 'user', sessionId: '' });
	}
	return { db, token };
}
