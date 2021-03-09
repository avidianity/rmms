import { Model } from './Model';
import { PrenatalRecord } from './PrenatalRecord';
import { PrescriptionItem } from './PrescriptionItem';
import { Record } from './Record';
import { User } from './User';

export interface Prescription extends Model {
	released_at: string | null;
	doctor_id: number;
	doctor?: User;
	recordable?: Record | PrenatalRecord;
	items?: PrescriptionItem[];
}
