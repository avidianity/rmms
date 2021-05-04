<?php

namespace App\Http\Controllers;

use App\Models\ImmunizationRecord;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ImmunizationRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ImmunizationRecord::paginate(10);
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
            'name' => ['required', 'string', 'max:255', Rule::unique(ImmunizationRecord::class)],
            'birthday' => ['required', 'date'],
            'outcome' => ['nullable', 'string', Rule::in(['Male', 'Female'])],
            'address' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'string', 'max:255'],
            'nbs' => ['required', 'string', 'max:255'],
            'mother' => ['required', 'string', 'max:255'],
            'father' => ['required', 'string', 'max:255'],
            'tt_injection' => ['nullable', 'string', 'max:255'],
            'time_of_del' => ['required', 'string', 'max:255'],
            'type_of_del' => ['required', 'string', 'max:255'],
            'place_of_del' => ['required', 'string', 'max:255'],
            'info' => ['required', 'array'],
            'info.bcg.at_birth' => ['nullable', 'string', 'max:255'],
            'info.bcg.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.nine_months' => ['nullable', 'string', 'max:255'],
            'info.penta.at_birth' => ['nullable', 'string', 'max:255'],
            'info.penta.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.nine_months' => ['nullable', 'string', 'max:255'],
            'info.opv.at_birth' => ['nullable', 'string', 'max:255'],
            'info.opv.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.nine_months' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.at_birth' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.nine_months' => ['nullable', 'string', 'max:255'],
            'info.measles.at_birth' => ['nullable', 'string', 'max:255'],
            'info.measles.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.nine_months' => ['nullable', 'string', 'max:255'],
            'info.mmr.at_birth' => ['nullable', 'string', 'max:255'],
            'info.mmr.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.nine_months' => ['nullable', 'string', 'max:255'],
            'info.other.at_birth' => ['nullable', 'string', 'max:255'],
            'info.other.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.nine_months' => ['nullable', 'string', 'max:255'],
        ]);

        return ImmunizationRecord::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ImmunizationRecord  $immunizationRecord
     * @return \Illuminate\Http\Response
     */
    public function show(ImmunizationRecord $immunizationRecord)
    {
        return $immunizationRecord;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ImmunizationRecord  $immunizationRecord
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ImmunizationRecord $immunizationRecord)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255', Rule::unique(ImmunizationRecord::class)->ignoreModel($immunizationRecord)],
            'birthday' => ['nullable', 'date'],
            'outcome' => ['nullable', 'string', Rule::in(['Male', 'Female'])],
            'address' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'string', 'max:255'],
            'nbs' => ['nullable', 'string', 'max:255'],
            'mother' => ['nullable', 'string', 'max:255'],
            'father' => ['nullable', 'string', 'max:255'],
            'tt_injection' => ['nullable', 'string', 'max:255'],
            'time_of_del' => ['nullable', 'string', 'max:255'],
            'type_of_del' => ['nullable', 'string', 'max:255'],
            'place_of_del' => ['nullable', 'string', 'max:255'],
            'info' => ['nullable', 'array'],
            'info.bcg.at_birth' => ['nullable', 'string', 'max:255'],
            'info.bcg.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.bcg.nine_months' => ['nullable', 'string', 'max:255'],
            'info.penta.at_birth' => ['nullable', 'string', 'max:255'],
            'info.penta.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.penta.nine_months' => ['nullable', 'string', 'max:255'],
            'info.opv.at_birth' => ['nullable', 'string', 'max:255'],
            'info.opv.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.opv.nine_months' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.at_birth' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.hepa_b.nine_months' => ['nullable', 'string', 'max:255'],
            'info.measles.at_birth' => ['nullable', 'string', 'max:255'],
            'info.measles.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.measles.nine_months' => ['nullable', 'string', 'max:255'],
            'info.mmr.at_birth' => ['nullable', 'string', 'max:255'],
            'info.mmr.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.mmr.nine_months' => ['nullable', 'string', 'max:255'],
            'info.other.at_birth' => ['nullable', 'string', 'max:255'],
            'info.other.six_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.ten_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.fourteen_weeks' => ['nullable', 'string', 'max:255'],
            'info.other.nine_months' => ['nullable', 'string', 'max:255'],
        ]);

        $immunizationRecord->update($data);

        return $immunizationRecord;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ImmunizationRecord  $immunizationRecord
     * @return \Illuminate\Http\Response
     */
    public function destroy(ImmunizationRecord $immunizationRecord)
    {
        $immunizationRecord->delete();

        return response('', 204);
    }

    public function archived()
    {
        return ImmunizationRecord::oldest('created_at')
            ->whereYear('created_at', '<', now()->year - 1)
            ->paginate(10);
    }
}
