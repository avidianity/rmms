<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\User;
use App\Rules\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class PrescriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Prescription::with('doctor')->paginate(15);
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
            'doctor_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Doctor'])],
            'released_at' => ['nullable', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'items.*.quantity' => ['required', 'numeric'],
        ]);

        $prescription = Prescription::create($data);

        if (Arr::has($data, 'items')) {
            $this->saveItems($prescription, $data);
        }

        $prescription->load('items');

        return $prescription;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Prescription  $prescription
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Prescription::with([
            'doctor',
            'recordable.patient',
            'items.medicine',
        ])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Prescription  $prescription
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Prescription $prescription)
    {
        $data = $request->validate([
            'released_at' => ['nullable', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'items.*.quantity' => ['required', 'numeric'],
        ]);

        $prescription->update($data);

        if (Arr::has($data, 'items')) {
            $prescription->items()->delete();
            $this->saveItems($prescription, $data);
        }

        return $prescription;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Prescription  $prescription
     * @return \Illuminate\Http\Response
     */
    public function destroy(Prescription $prescription)
    {
        $prescription->delete();

        return response('', 204);
    }

    protected function saveItems($prescription, $data)
    {
        $prescription->items()->createMany($data['items']);
    }
}
