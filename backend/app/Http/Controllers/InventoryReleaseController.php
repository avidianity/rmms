<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryRelease;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InventoryReleaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return InventoryRelease::with('inventory')->paginate(10);
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
            'quantity' => ['required', 'numeric'],
            'date' => ['required', 'string'],
            'inventory_id' => ['required', 'numeric', Rule::exists(Inventory::class, 'id')],
        ]);

        $inventory = Inventory::findOrFail($data['inventory_id']);

        return $inventory->releases()->create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\InventoryRelease  $inventoryRelease
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return InventoryRelease::with('inventory')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\InventoryRelease  $inventoryRelease
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $inventoryRelease = InventoryRelease::with('inventory')->findOrFail($id);
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'numeric'],
            'date' => ['nullable', 'date'],
        ]);

        $inventoryRelease->update($data);

        return $inventoryRelease;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\InventoryRelease  $inventoryRelease
     * @return \Illuminate\Http\Response
     */
    public function destroy(InventoryRelease $inventoryRelease)
    {
        $inventoryRelease->delete();

        return response('', 204);
    }
}
