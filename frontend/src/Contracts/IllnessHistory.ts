import { Model } from './Model';
import { Patient } from './Patient';

export interface IllnessHistory extends Model {
	physical_exams: {
		bp: string;
		wt: string;
		ht: string;
		spo2: string;
		pr: string;
		tt: string;
	};
	patient_id: number;
	patient?: Patient;
}
