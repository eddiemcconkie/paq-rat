import { record } from '$lib/validators/id.js';
import { Role } from '$lib/validators/role.js';
import { User } from '$lib/validators/user.js';
import { z } from 'zod';

export const BelongsTo = z
	.object({
		id: record(),
		owner: User,
		group: record(),
		role: Role,
	})
	.array();
