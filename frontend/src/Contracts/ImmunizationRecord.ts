import { Model } from './Model';

type Record = {
	at_birth: string;
	six_weeks: string;
	ten_weeks: string;
	fourteen_weeks: string;
	nine_months: string;
};

export interface ImmunizationRecord extends Model {
	name: string;
	birthday: string;
	outcome: string;
	address: string;
	weight: string;
	nbs: string;
	gender: string;
	mother: string;
	father: string;
	tt_injection: string;
	time_of_del: string;
	type_of_del: string;
	place_of_del: string;
	info: {
		bcg: Record;
		penta: Record;
		opv: Record;
		hepa_b: Record;
		measles: Record;
		mmr: Record;
		other: Record;
	};
}
