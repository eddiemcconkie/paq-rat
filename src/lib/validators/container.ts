import { z } from 'zod';
import { record } from './id';
import { Role } from './role';

export const Container = z.object({
	id: record(),
	label: z.string(),
	type: z.string(),
	location: z.string(),
	contents: z.string().array(),
	visibility: Role,
	created: z.coerce.date(),
	updated: z.coerce.date(),
});
export type Container = z.infer<typeof Container>;
