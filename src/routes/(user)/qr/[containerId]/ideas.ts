import { sampleSize } from 'lodash-es';

const labelIdeas = [
	'Bathroom',
	'Kitchen',
	'Bedroom',
	'Clothes',
	'Electronics',
	'Books',
	'Toys',
	'Food',
	'School',
	'Board games',
	'Movies',
	'Office',
];

export function getLabelIdeas() {
	return sampleSize(labelIdeas, 3).join(', ') + '...';
}

export const containerTypeIdeas = [
	'Cardboard box',
	'Folder',
	'Filing cabinet',
	'Storage bin',
	'Drawer',
	'Cupboard',
	'Dresser',
	'Garage',
	'Toolbox',
	'Workbench',
];

export function getContainerTypeIdeas() {
	return sampleSize(containerTypeIdeas, 3).join(', ') + '...';
}

export const locationIdeas = ['Home', 'Office', 'Garage', 'Storage unit'];

export function getLocationIdeas() {
	return sampleSize(locationIdeas, 3).join(', ') + '...';
}
