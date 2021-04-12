import { Inventory } from './Inventory';
import { Model } from './Model';

export interface InventoryRelease extends Model {
	name: string;
	quantity: number;
	date: string;
	inventory_id: number;
	inventory?: Inventory;
}
