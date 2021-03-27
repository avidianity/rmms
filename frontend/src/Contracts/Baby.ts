import { BabyVaccination } from './BabyVaccination';
import { Model } from './Model';
import { User } from './User';

export interface Baby extends Model {
	attendee_id: number;
	name: string;
	nickname: string | null;
	father: string;
	mother: string;
	sex: string;
	type_of_birth: string;
	date_of_birth: string;
	complete_in_months: boolean;
	single_or_twin: string;
	blood_type: string;
	weight: string;
	length_of_body: string;
	head_measurement: string;
	chest_measurement: string;
	order_of_birth: string;
	name_registration_date: string;
	name_registration_location: string;
	mishaps: string | null;
	attendee?: User;
	vaccinations?: BabyVaccination[];
}
