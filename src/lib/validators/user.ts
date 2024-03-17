import { z } from 'zod';
import { record } from './id';

export const UserInternal = z.object({
	id: record(),
	googleId: z.string(),
	givenName: z.string().optional(),
	familyName: z.string().optional(),
	name: z.string(),
	email: z.string(),
	picture: z.string().optional(),
});
export const User = UserInternal.omit({ googleId: true });
export const UserNoId = User.omit({ id: true });

export type User = z.infer<typeof User>;
export type UserNoId = z.infer<typeof UserNoId>;
export type UserInternal = z.infer<typeof UserInternal>;
