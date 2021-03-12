import { Model } from './Model';
import { Patient } from './Patient';

export interface IllnessHistory extends Model {
	date: string;
	description: string;
	physical_exams: {
		bp: string;
		wt: string;
		ht: string;
		spo2: string;
		pr: string;
		tt: string;
	};
	assessment: string;
	treatment: string;
	patient_id: number;
	patient?: Patient;
}
