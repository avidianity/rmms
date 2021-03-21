import { Model } from './Model';

export interface BabyVaccination extends Model {
	name: string;
	doses: string;
	date: string;
	remarks: string;
}
