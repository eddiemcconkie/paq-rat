import { $ } from 'bun';

type Result<T> =
	| {
			status: 'OK';
			result: T;
	  }
	| {
			status: 'ERR';
			result: string;
	  };

type Results<T extends readonly unknown[]> = T extends [infer First, ...infer Rest]
	? [Result<First>, ...Results<Rest>]
	: T;

export async function execSql<TResults extends unknown[]>(sql: string): Promise<Results<TResults>> {
	const response =
		await $`curl -X POST -u "$SURREAL_USER:$SURREAL_PASS" -H "NS: $PUBLIC_SURREAL_NS" -H "DB: $PUBLIC_SURREAL_DB" -H "Accept: application/json" -d ${sql} "$PUBLIC_SURREAL_HOST/sql"`
			.env(Bun.env as Record<string, string>)
			.json();
	return response;
}
