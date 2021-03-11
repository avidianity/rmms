import { Model } from './Model';

export interface Inventory extends Model {
	name: string;
	cost: number;
	stocks: number;
}
