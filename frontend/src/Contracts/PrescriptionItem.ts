import { Medicine } from './Medicine';
import { Model } from './Model';
import { Prescription } from './Prescription';

export interface PrescriptionItem extends Model {
	medicine_id: number;
	prescription_id: number;
	quantity: number;
	medicine?: Medicine;
	prescription?: Prescription;
}
