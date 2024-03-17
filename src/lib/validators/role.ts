import type { z } from 'zod';
import { record } from './id';

export const roles = ['owner', 'family', 'friend'] as const;

export const Role = record().refine((role): role is (typeof roles)[number] => roles.includes(role));
export type Role = z.infer<typeof Role>;
