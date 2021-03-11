import { Model } from './Model';
import { PrenatalRecord } from './PrenatalRecord';
import { Record } from './Record';

export interface Patient extends Model {
	name: string;
	age: number;
	sex: string;
	birthday: string;
	address: string;
	civil_status: string | null;
	membership_nh: string | null;
	membership_nn: string | null;
	philhealth_number: string | null;
	contact_number: string | null;
	'4ps': string | null;
	blood_type: string | null;
	religion: string | null;
	records?: Record[];
	prenatals?: PrenatalRecord[];
}
