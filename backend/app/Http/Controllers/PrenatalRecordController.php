<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PrenatalRecord;
use App\Models\User;
use App\Rules\Role;
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
            ->with(['attendee', 'patient'])
            ->paginate(15);
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
            'attendee_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
            'patient_id' => ['required', 'numeric', Rule::exists(Patient::class, 'id')],
        ]);

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
        return PrenatalRecord::with(['attendee', 'patient'])->findOrFail($id);
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
            'attendee_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
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
}
