import { InventoryRelease } from './InventoryRelease';
import { Model } from './Model';

export interface Inventory extends Model {
	description: string;
	number_of_units: number;
	unit_of_issue: string;
	estimated_unit_cost: number;
	quantity: number;
	date_delivered: string | null;
	expiry_date: string;
	critical_value: number;
	readonly released: number;
	readonly available: number;
	readonly estimated_cost: number;
	releases?: InventoryRelease[];
}
