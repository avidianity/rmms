<?php

namespace App\Http\Controllers;

use App\Models\IllnessHistory;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $builder = new Patient();

        $builder = $builder->latest();

        if ($request->has('name')) {
            $name = $request->input('name');
            $builder = $builder->where('name', 'LIKE', "%{$name}%");
        }

        if ($request->has('sex') && in_array($sex = $request->input('sex'), ['Male', 'Female'])) {
            $builder = $builder->where('sex', $sex);
        }
        if ($request->input('paginate', 'true') === 'false') {
            return $builder->get();
        } else {
            return $builder->paginate(10);
        }
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
            'name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'numeric'],
            'sex' => ['required', 'string', Rule::in(['Male', 'Female'])],
            'birthday' => ['required', 'date'],
            'address' => ['required', 'string', 'max:255'],
            'civil_status' => ['nullable', 'string', 'max:255'],
            'membership' => ['nullable', 'string', 'max:255'],
            'philhealth_number' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            '4ps' => ['nullable', 'string', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'histories' => ['nullable', 'array'],
            'histories.*.physical_exams' => ['required'],
        ]);

        $patient = Patient::where('name', $data['name'])
            ->where('sex', $data['sex'])
            ->whereBirthday(Carbon::parse($data['birthday']))
            ->first();

        if (!$patient) {
            $patient = Patient::create($data);
        } else {
            $patient->update($data);
        }

        if (isset($data['histories'])) {
            $this->saveHistories($patient, $data);
        }

        return $patient;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Patient  $patient
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Patient::with([
            'records.prescriptions.items.medicine',
            'prenatals.prescriptions.items.medicine',
            'records.doctor',
            'prenatals.attendee',
            'histories',
        ])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Patient  $patient
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'age' => ['nullable', 'numeric'],
            'sex' => ['nullable', 'string', Rule::in(['Male', 'Female'])],
            'birthday' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'civil_status' => ['nullable', 'string', 'max:255'],
            'membership' => ['nullable', 'string', 'max:255'],
            'philhealth_number' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            '4ps' => ['nullable', 'string', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'histories' => ['nullable', 'array'],
            'histories.*.physical_exams' => ['required'],
        ]);

        /**
         * @var Patient
         */
        $patient = Patient::with(['records.prescriptions.items.medicine', 'prenatals.prescriptions.items.medicine'])->findOrFail($id);

        $patient->update($data);

        if (isset($data['histories'])) {
            $patient->histories()->delete();
            $this->saveHistories($patient, $data);
        }

        return $patient;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Patient  $patient
     * @return \Illuminate\Http\Response
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response('', 204);
    }

    /**
     * Save histories
     *
     * @param Patient $patient
     * @param array $data
     * @return void
     */
    protected function saveHistories($patient, $data)
    {
        $histories = collect($data['histories'])->map(function ($row) {
            return new IllnessHistory($row);
        });

        $patient->histories()->saveMany($histories);
    }
}
