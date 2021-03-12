<?php

namespace App\Http\Controllers;

use App\Models\Baby;
use App\Models\File;
use App\Models\User;
use App\Rules\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BabyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Baby::with('attendee')->paginate(10);
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
            'file' => ['required'],
            'attendee_id' => ['required', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'father' => ['required', 'string', 'max:255'],
            'mother' => ['required', 'string', 'max:255'],
            'type_of_birth' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'complete_in_months' => ['required', 'boolean'],
            'single_or_twin' => ['required', 'string', 'max:255'],
            'blood_type' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'string', 'max:255'],
            'length_of_body' => ['required', 'string', 'max:255'],
            'head_measurement' => ['required', 'string', 'max:255'],
            'sex' => ['required', 'string', 'max:255'],
            'chest_measurement' => ['required', 'string', 'max:255'],
            'order_of_birth' => ['required', 'string', 'max:255'],
            'name_registration_date' => ['required', 'date'],
            'name_registration_location' => ['required', 'string', 'max:255'],
            'mishaps' => ['nullable', 'string', 'max:255'],
        ]);

        $file = File::process($data['file']);
        $file->save();

        $data['file_id'] = $file->id;

        return Baby::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Baby  $baby
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Baby::with('attendee', 'file')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Baby  $baby
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Baby $baby)
    {
        $data = $request->validate([
            'file' => ['nullable'],
            'attendee_id' => ['nullable', 'numeric', Rule::exists(User::class, 'id'), new Role(['Nurse', 'Midwife'])],
            'name' => ['nullable', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:255'],
            'father' => ['nullable', 'string', 'max:255'],
            'mother' => ['nullable', 'string', 'max:255'],
            'type_of_birth' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'complete_in_months' => ['nullable', 'boolean'],
            'sex' => ['nullable', 'string', 'max:255'],
            'single_or_twin' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'string', 'max:255'],
            'length_of_body' => ['nullable', 'string', 'max:255'],
            'head_measurement' => ['nullable', 'string', 'max:255'],
            'chest_measurement' => ['nullable', 'string', 'max:255'],
            'order_of_birth' => ['nullable', 'string', 'max:255'],
            'name_registration_date' => ['nullable', 'date'],
            'name_registration_location' => ['nullable', 'string', 'max:255'],
            'mishaps' => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($data['file'])) {
            $old = $baby->file;
            $file = File::process($data['file']);
            $file->save();
            $baby->file_id = $file->id;
            $baby->save();
            $baby->load('file');
            $old->delete();
        }

        $baby->update($data);

        return $baby;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Baby  $baby
     * @return \Illuminate\Http\Response
     */
    public function destroy(Baby $baby)
    {
        $baby->delete();

        return response('', 204);
    }
}
