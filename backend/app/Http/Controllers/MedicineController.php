<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $builder = new Medicine();
        $builder = $builder->latest();
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
            'description' => ['required', 'string', 'max:255'],
            'number_of_units' => ['required', 'numeric'],
            'unit_of_issue' => ['required', 'string', 'max:255'],
            'estimated_unit_cost' => ['required', 'numeric'],
            'quantity' => ['required', 'numeric'],
            'date_delivered' => ['nullable', 'date'],
            'expiry_date' => ['required', 'date'],
            'critical_value' => ['required', 'numeric'],
        ]);

        return Medicine::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Medicine  $medicine
     * @return \Illuminate\Http\Response
     */
    public function show(Medicine $medicine)
    {
        return $medicine;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Medicine  $medicine
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Medicine $medicine)
    {
        $data = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'number_of_units' => ['nullable', 'numeric'],
            'unit_of_issue' => ['nullable', 'string', 'max:255'],
            'estimated_unit_cost' => ['nullable', 'numeric'],
            'quantity' => ['nullable', 'numeric'],
            'date_delivered' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'critical_value' => ['nullable', 'numeric'],
        ]);

        $medicine->update($data);

        return $medicine;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Medicine  $medicine
     * @return \Illuminate\Http\Response
     */
    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return response('', 204);
    }

    public function expiring()
    {
        $now = now();
        return Medicine::latest('expiry_date')
            ->whereDay('expiry_date', '>', $now->day)
            ->whereMonth('expiry_date', $now->month)
            ->whereYear('expiry_date', $now->year)
            ->get();
    }

    public function critical()
    {
        return Medicine::latest('expiry_date')
            ->get()
            ->filter(function (Medicine $medicine) {
                return $medicine->available <= $medicine->critical_value;
            });
    }
}
