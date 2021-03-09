import { Medicine } from './Medicine';
import { Model } from './Model';
import { PurchaseRequest } from './PurchaseRequest';

export interface PurchaseRequestItem extends Model {
	medicine_id: number;
	purchase_request_id: number;
	quantity: number;
	medicine?: Medicine;
	request?: PurchaseRequest;
}
