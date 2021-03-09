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
        if ($request->input('paginate', 'true') === 'false') {
            return $builder->get();
        } else {
            return $builder->paginate(15);
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
            'unit_of_issue' => ['required', 'string', 'max:255'],
            'cost' => ['required', 'numeric'],
            'stocks' => ['nullable', 'numeric'],
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
            'unit_of_issue' => ['nullable', 'string', 'max:255'],
            'cost' => ['nullable', 'numeric'],
            'stocks' => ['nullable', 'numeric'],
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
}
