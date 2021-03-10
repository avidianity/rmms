<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Medicine
 *
 * @property int $id
 * @property string $name
 * @property string $unit_of_issue
 * @property mixed $cost
 * @property int $stocks
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PurchaseRequestItem[] $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine query()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereStocks($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereUnitOfIssue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereUpdatedAt($value)
 */
	class Medicine extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Model
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Model newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Model newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Model query()
 */
	class Model extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Patient
 *
 * @property int $id
 * @property string $name
 * @property int $age
 * @property string $sex
 * @property mixed $birthday
 * @property string $address
 * @property string|null $civil_status
 * @property string|null $membership_nh
 * @property string|null $membership_nn
 * @property string|null $philhealth_number
 * @property string|null $contact_number
 * @property string|null $phic
 * @property string|null $4ps
 * @property string|null $blood_type
 * @property string|null $religion
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PrenatalRecord[] $prenatals
 * @property-read int|null $prenatals_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Record[] $records
 * @property-read int|null $records_count
 * @method static \Illuminate\Database\Eloquent\Builder|Patient newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Patient newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Patient query()
 * @method static \Illuminate\Database\Eloquent\Builder|Patient where4ps($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereBloodType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereCivilStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereContactNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereMembershipNh($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereMembershipNn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient wherePhic($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient wherePhilhealthNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereReligion($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereSex($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Patient whereUpdatedAt($value)
 */
	class Patient extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PrenatalRecord
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $case_number
 * @property string|null $lmp
 * @property string|null $edc
 * @property string|null $aog
 * @property string|null $bp
 * @property string|null $wt
 * @property string|null $ht
 * @property string|null $fht
 * @property string|null $fh
 * @property string|null $toxoid
 * @property string|null $lab_requests
 * @property string|null $feso4
 * @property string|null $remarks
 * @property string|null $screened_syphilis
 * @property string|null $screened_hepatitis
 * @property string|null $screened_hiv
 * @property string|null $screened_gestational_diabetes
 * @property string|null $diagnosed_anemia
 * @property string|null $cbc_hgb_hct
 * @property string|null $deworming_dose
 * @property int $attendee_id
 * @property int $patient_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $attendee
 * @property-read \App\Models\Patient $patient
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Prescription[] $prescriptions
 * @property-read int|null $prescriptions_count
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereAog($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereAttendeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereBp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereCaseNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereCbcHgbHct($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereDewormingDose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereDiagnosedAnemia($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereEdc($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereFeso4($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereFh($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereFht($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereHt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereLabRequests($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereLmp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord wherePatientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereRemarks($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereScreenedGestationalDiabetes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereScreenedHepatitis($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereScreenedHiv($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereScreenedSyphilis($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereToxoid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrenatalRecord whereWt($value)
 */
	class PrenatalRecord extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Prescription
 *
 * @property int $id
 * @property string $recordable_type
 * @property int $recordable_id
 * @property int $doctor_id
 * @property \Illuminate\Support\Carbon|null $released_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $doctor
 * @property-read mixed $released
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PrescriptionItem[] $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $recordable
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription query()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereDoctorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereRecordableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereRecordableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereReleasedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereUpdatedAt($value)
 */
	class Prescription extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PrescriptionItem
 *
 * @property int $id
 * @property int $medicine_id
 * @property int $prescription_id
 * @property int $quantity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Medicine $medicine
 * @property-read \App\Models\Prescription $prescription
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem whereMedicineId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem wherePrescriptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PrescriptionItem whereUpdatedAt($value)
 */
	class PrescriptionItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PurchaseRequest
 *
 * @property PurchaseRequestItem[] $items
 * @property int $id
 * @property string|null $pr_number
 * @property string|null $sai_number
 * @property string|null $obr_number
 * @property \Illuminate\Support\Carbon|null $delivered
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereDelivered($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereObrNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest wherePrNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereSaiNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequest whereUpdatedAt($value)
 */
	class PurchaseRequest extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PurchaseRequestItem
 *
 * @property Medicine $medicine
 * @property int $id
 * @property int $purchase_request_id
 * @property int $medicine_id
 * @property int $quantity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PurchaseRequest $request
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem whereMedicineId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem wherePurchaseRequestId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PurchaseRequestItem whereUpdatedAt($value)
 */
	class PurchaseRequestItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Record
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $case_number
 * @property string|null $diagnosis
 * @property int $doctor_id
 * @property int $patient_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $doctor
 * @property-read \App\Models\Patient $patient
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Prescription[] $prescriptions
 * @property-read int|null $prescriptions_count
 * @method static \Illuminate\Database\Eloquent\Builder|Record newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Record newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Record query()
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereCaseNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereDiagnosis($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereDoctorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record wherePatientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Record whereUpdatedAt($value)
 */
	class Record extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Token
 *
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $tokenable
 * @method static \Illuminate\Database\Eloquent\Builder|Token newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Token newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Token query()
 */
	class Token extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PrenatalRecord[] $prenatals
 * @property-read int|null $prenatals_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Prescription[] $prescriptions
 * @property-read int|null $prescriptions_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Record[] $records
 * @property-read int|null $records_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

