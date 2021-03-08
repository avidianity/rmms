import { Model } from './Model';

export interface Medicine extends Model {
	name: string;
	unit_of_issue: string;
	cost: number;
	stocks: number;
}
