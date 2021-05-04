import { Model } from './Model';
import { Patient } from './Patient';
import { Prescription } from './Prescription';
import { User } from './User';

export interface Record extends Model {
	case_number: string;
	diagnosis: string;
	doctor_id: number;
	patient_id: number;
	chief_complaint: string;
	status: string;
	patient?: Patient;
	doctor?: User;
	prescriptions?: Prescription[];
}
