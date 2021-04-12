<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->input('paginate', 'true') === 'false') {
            return Inventory::latest()->get();
        }
        return Inventory::latest()->paginate(10);
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

        return Inventory::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function show(Inventory $inventory)
    {
        return $inventory;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Inventory $inventory)
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

        $inventory->update($data);

        return $inventory;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();

        return response('', 204);
    }

    public function expiring()
    {
        $now = now();
        return Inventory::latest('expiry_date')
            ->whereDay('expiry_date', '>', $now->day)
            ->whereMonth('expiry_date', $now->month)
            ->whereYear('expiry_date', $now->year)
            ->get();
    }

    public function critical()
    {
        return Inventory::latest('expiry_date')
            ->get()
            ->filter(function (Inventory $medicine) {
                return $medicine->available <= $medicine->critical_value;
            });
    }
}
