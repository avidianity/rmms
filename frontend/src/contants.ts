import { FreeObject } from './Contracts/misc';

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const URL_REGEX = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const RecordableMap = {
	Record: 'Regular Record',
	PrenatalRecord: 'Prenatal Record',
} as FreeObject;

export const STATUSES = {
	RegularRecord: ['Pending', 'Done'],
	PrenatalRecord: ['Pending', 'Done'],
	Immunization: {
		fields: [
			{ key: 'bcg', name: 'BCG' },
			{ key: 'penta', name: 'Penta' },
			{ key: 'opv', name: 'OPV' },
			{ key: 'hepa_b', name: 'Hepa B' },
			{ key: 'mmr', name: 'MMR' },
			{ key: 'other', name: 'Other' },
		],
		properties: ['at_birth', 'six_weeks', 'fourteen_weeks', 'nine_months'],
	},
};
