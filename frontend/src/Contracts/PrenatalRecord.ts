import { Model } from './Model';
import { Patient } from './Patient';
import { Prescription } from './Prescription';
import { User } from './User';

export interface PrenatalRecord extends Model {
	case_number: string;
	lmp: string | null;
	edc: string | null;
	aog: string | null;
	bp: string | null;
	wt: string | null;
	ht: string | null;
	fht: string | null;
	fh: string | null;
	toxoid: string | null;
	lab_requests: string | null;
	feso4: string | null;
	screened_syphilis: string | null;
	screened_hepatitis: string | null;
	screened_hiv: string | null;
	screened_gestational_diabetes: string | null;
	diagnosed_anemia: string | null;
	cbc_hgb_hct: string | null;
	deworming_dose: string | null;
	phic: string | null;
	bmi: string | null;
	attendee_id: number;
	patient_id: number;
	status: string;
	remarks: string | null;
	delivery_status: string | null;
	delivery_outcome: string | null;
	attendee?: User;
	patient?: Patient;
	prescriptions?: Prescription[];
}
