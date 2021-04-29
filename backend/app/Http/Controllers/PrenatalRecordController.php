<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PrenatalRecord;
use App\Models\User;
use App\Rules\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PrenatalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return PrenatalRecord::orderBy('case_number', 'DESC')
            ->latest('case_number')
            ->with(['attendee', 'patient'])
            ->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'lmp' => ['nullable', 'string', 'max:255'],
            'edc' => ['nullable', 'string', 'max:255'],
            'aog' => ['nullable', 'string', 'max:255'],
            'bp' => ['nullable', 'string', 'max:255'],
            'wt' => ['nullable', 'string', 'max:255'],
            'ht' => ['nullable', 'string', 'max:255'],
            'fht' => ['nullable', 'string', 'max:255'],
            'fh' => ['nullable', 'string', 'max:255'],
            'toxoid' => ['nullable', 'string', 'max:255'],
            'lab_requests' => ['nullable', 'string', 'max:255'],
            'feso4' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:255'],
            'screened_syphilis' => ['nullable', 'string', 'max:255'],
            'screened_hepatitis' => ['nullable', 'string', 'max:255'],
            'screened_hiv' => ['nullable', 'string', 'max:255'],
            'screened_gestational_diabetes' => ['nullable', 'string', 'max:255'],
            'diagnosed_anemia' => ['nullable', 'string', 'max:255'],
            'cbc_hgb_hct' => ['nullable', 'string', 'max:255'],
            'deworming_dose' => ['nullable', 'string', 'max:255'],
            'phic' => ['nullable', 'string', 'max:255'],
            'bmi' => ['nullable', 'string', 'max:255'],
            'delivery_status' => ['nullable', Rule::in(['Alive', 'Deceased'])],
            'delivery_outcome' => ['nullable', Rule::in(['Male', 'Female'])],
            'attendee_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
            'patient_id' => ['required', 'numeric', Rule::exists(Patient::class, 'id')],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.doctor_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
            'prescriptions.items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'prescriptions.items.*.quantity' => ['required', 'numeric'],
        ]);

        if (Patient::whereId($data['patient_id'])->whereHas('prenatals', function (Builder $query) {
            $query->whereDate('updated_at', now())
                ->where('status', '!=', 'Done');
        })->count() > 0) {
            return response(['message' => 'Patient already has a prenatal record today. Please update it instead.'], 403);
        }

        return PrenatalRecord::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PrenatalRecord  $prenatalRecord
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return PrenatalRecord::with(['attendee', 'patient', 'prescriptions.items.medicine'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PrenatalRecord  $prenatalRecord
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $prenatalRecord = PrenatalRecord::with(['patient'])->findOrFail($id);
        $data = $request->validate([
            'lmp' => ['nullable', 'string', 'max:255'],
            'edc' => ['nullable', 'string', 'max:255'],
            'aog' => ['nullable', 'string', 'max:255'],
            'bp' => ['nullable', 'string', 'max:255'],
            'wt' => ['nullable', 'string', 'max:255'],
            'ht' => ['nullable', 'string', 'max:255'],
            'fht' => ['nullable', 'string', 'max:255'],
            'fh' => ['nullable', 'string', 'max:255'],
            'toxoid' => ['nullable', 'string', 'max:255'],
            'lab_requests' => ['nullable', 'string', 'max:255'],
            'feso4' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:255'],
            'screened_syphilis' => ['nullable', 'string', 'max:255'],
            'screened_hepatitis' => ['nullable', 'string', 'max:255'],
            'screened_hiv' => ['nullable', 'string', 'max:255'],
            'screened_gestational_diabetes' => ['nullable', 'string', 'max:255'],
            'diagnosed_anemia' => ['nullable', 'string', 'max:255'],
            'cbc_hgb_hct' => ['nullable', 'string', 'max:255'],
            'deworming_dose' => ['nullable', 'string', 'max:255'],
            'phic' => ['nullable', 'string', 'max:255'],
            'bmi' => ['nullable', 'string', 'max:255'],
            'delivery_status' => ['nullable', Rule::in(['Alive', 'Deceased'])],
            'delivery_outcome' => ['nullable', Rule::in(['Male', 'Female'])],
            'attendee_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.doctor_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
            'prescriptions.items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'prescriptions.items.*.quantity' => ['required', 'numeric'],
        ]);

        $prenatalRecord->update($data);

        $prenatalRecord->load(['attendee']);

        return $prenatalRecord;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PrenatalRecord  $prenatalRecord
     * @return \Illuminate\Http\Response
     */
    public function destroy(PrenatalRecord $prenatalRecord)
    {
        $prenatalRecord->delete();

        return response('', 204);
    }

    public function archived()
    {
        return PrenatalRecord::with(['attendee', 'patient'])
            ->oldest('created_at')
            ->whereYear('created_at', '<', now()->year - 1)
            ->paginate(10);
    }

    /**
     * @param PrenatalRecord $record
     */
    protected function savePrescriptions($record, $data)
    {
        collect($data['prescriptions'])->each(function ($row) use ($record) {
            /**
             * @var Prescription
             */
            $prescription = $record->prescriptions()->create(['doctor_id' => $row['doctor_id']]);

            collect($row['items'])->each(function ($item) use ($prescription) {
                $prescription->items()->create($item);
            });
        });
    }
}
