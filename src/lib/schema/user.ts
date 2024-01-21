import { z } from 'zod';

export const User = z
	.object({
		id: z.string(),
		email: z.string(),
		image: z.string(),
	})
	.transform((user) => ({ ...user, thing: '' }));

export type User = z.infer<typeof User>;
