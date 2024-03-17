import { z } from 'zod';
import { record } from './id';
import { Role } from './role';

export const Invite = z.object({
	id: record(),
	owner: record(),
	group: record(),
	role: Role,
});

export type Invite = z.infer<typeof Invite>;
