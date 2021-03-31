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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'unit_of_issue' => ['required', 'string', 'max:255'],
            'estimated_unit_cost' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric'],
            'date_delivered' => ['required', 'date'],
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
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'unit_of_issue' => ['nullable', 'string', 'max:255'],
            'estimated_unit_cost' => ['nullable', 'string', 'max:255'],
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
}
