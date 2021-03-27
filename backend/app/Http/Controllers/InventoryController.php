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
    public function index()
    {
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'unit_of_issue' => ['required', 'string', 'max:255'],
            'estimated_unit_cost' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric'],
            'released' => ['required', 'string', 'max:255'],
            'available' => ['required', 'string', 'max:255'],
            'date_delivered' => ['required', 'date'],
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
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'unit_of_issue' => ['nullable', 'string', 'max:255'],
            'estimated_unit_cost' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'numeric'],
            'released' => ['nullable', 'string', 'max:255'],
            'available' => ['nullable', 'string', 'max:255'],
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
}
