<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Prescription;
use App\Models\Record;
use App\Models\User;
use App\Rules\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        return Record::with(['doctor', 'patient'])
            ->orderBy('case_number', 'DESC')
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
            'diagnosis' => ['nullable', 'string', 'max:255'],
            'doctor_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
            'patient_id' => ['required', 'numeric', Rule::exists(Patient::class, 'id')],
            'status' => ['required', 'string', 'max:255'],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'prescriptions.items.*.quantity' => ['required', 'numeric'],
        ]);

        $record = Record::create($data);

        if (Arr::has($data, 'prescriptions')) {
            $this->savePrescriptions($record, $data);
        }

        return $record;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Record  $record
     * @return \Illuminate\Http\Response
     */
    public function show(Record $record)
    {
        return $record->load(['doctor', 'patient', 'prescriptions.items.medicine']);
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
            'status' => ['nullable', 'string', 'max:255'],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'prescriptions.items.*.quantity' => ['required', 'numeric'],
        ]);

        if (Arr::has($data, 'prescriptions')) {
            $record->prescriptions
                ->filter(function ($prescription) {
                    return !$prescription->released;
                })
                ->each(function ($prescription) {
                    $prescription->delete();
                });
            $this->savePrescriptions($record, $data);
        }

        $record->update($data);

        $record->load(['doctor', 'patient']);

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

    /**
     * @param Record $record
     */
    protected function savePrescriptions($record, $data)
    {
        collect($data['prescriptions'])->each(function ($row) use ($record) {
            /**
             * @var Prescription
             */
            $prescription = $record->prescriptions()->create(['doctor_id' => $record->doctor_id]);

            collect($row['items'])->each(function ($item) use ($prescription) {
                $prescription->items()->create($item);
            });
        });
    }
}
