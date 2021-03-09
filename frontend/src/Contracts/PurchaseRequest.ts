import { Model } from './Model';
import { PrenatalRecord } from './PrenatalRecord';
import { PurchaseRequestItem } from './PurchaseRequestItem';
import { Record } from './Record';

export interface PurchaseRequest extends Model {
	pr_number: string;
	sai_number: string;
	obr_number: string;
	delivered: string | null;
	items?: PurchaseRequestItem[];
}
