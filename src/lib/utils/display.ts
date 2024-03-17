import type { Role } from '$lib/validators/role';

export function getIdDisplay(id: string) {
	return id.slice(-4).toUpperCase();
}

export function getVisibilityDisplay(visibility: Role) {
	switch (visibility) {
		case 'owner':
			return 'Private';
		case 'family':
			return 'Family';
		case 'friend':
			return 'Friends';
	}
}
