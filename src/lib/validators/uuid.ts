import { z } from 'zod';

const UUID = z.string().uuid();
export function isUUID(id: string) {
	return UUID.safeParse(id).success;
}
