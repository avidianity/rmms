import { Model } from './Model';

export interface Inventory extends Model {
	name: string;
	description: string;
	unit_of_issue: string;
	estimated_unit_cost: string;
	quantity: number;
	released: string;
	available: string;
	date_delivered: string;
	expiry_date: string;
	critical_value: number;
}
