<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
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
        $builder = Patient::with(['records.requests.items', 'prenatals.requests.items']);

        if ($request->has('name')) {
            $name = $request->input('name');
            $builder = $builder->where('name', 'LIKE', "%{$name}%");
        }

        return $builder->paginate(15);
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
            'membership_nh' => ['nullable', 'string', 'max:255'],
            'membership_nn' => ['nullable', 'string', 'max:255'],
            'philhealth_number' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'phic' => ['nullable', 'string', 'max:255'],
            '4ps' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
        ]);

        $patient = Patient::where('name', $data['name'])
            ->where('sex', $data['sex'])
            ->whereDate('birthday', $data['birthday'])
            ->first();

        if (!$patient) {
            $patient = Patient::create($data);
        } else {
            $patient->update($data);
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
        return Patient::with(['records.prescriptions.items.medicine', 'prenatals.prescriptions.items.medicine'])->findOrFail($id);
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
            'membership_nh' => ['nullable', 'string', 'max:255'],
            'membership_nn' => ['nullable', 'string', 'max:255'],
            'philhealth_number' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'phic' => ['nullable', 'string', 'max:255'],
            '4ps' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'religion' => ['nullable', 'string', 'max:255'],
        ]);

        $patient = Patient::with(['records.prescriptions.items.medicine', 'prenatals.prescriptions.items.medicine'])->findOrFail($id);

        $patient->update($data);

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
}
