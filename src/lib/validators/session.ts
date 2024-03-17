import { z } from 'zod';
import { record } from './id';

export const Session = z.object({
	id: record(),
	expiresAt: z.coerce.date(),
	fresh: z.boolean(),
	userId: record(),
});
