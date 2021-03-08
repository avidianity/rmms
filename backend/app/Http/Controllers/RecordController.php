<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Record;
use App\Models\User;
use App\Rules\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Record::orderBy('case_number', 'DESC')->paginate(15);
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
            'diagnosis' => ['nullable', 'string', 'max:255'],
            'doctor_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
            'patient_id' => ['required', 'numeric', Rule::exists(Patient::class, 'id')],
        ]);

        return Record::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Record  $record
     * @return \Illuminate\Http\Response
     */
    public function show(Record $record)
    {
        return $record;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Record  $record
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Record $record)
    {
        $data = $request->validate([
            'diagnosis' => ['nullable', 'string', 'max:255'],
            'doctor_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
        ]);

        $record->update($data);

        return $record;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Record  $record
     * @return \Illuminate\Http\Response
     */
    public function destroy(Record $record)
    {
        $record->delete();

        return response('', 204);
    }
}
