import { Model } from './Model';

export interface File extends Model {
	type: string;
	name: string;
	size: number;
	url: string;
}
