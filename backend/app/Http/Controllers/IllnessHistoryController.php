<?php

namespace App\Http\Controllers;

use App\Models\IllnessHistory;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IllnessHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return IllnessHistory::latest()
            ->with('patient')
            ->paginate(10);
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
            'date' => ['required', 'date'],
            'description' => ['required', 'string', 'max:255'],
            'physical_exams' => ['required'],
            'assessment' => ['required', 'string'],
            'treatment' => ['required', 'string'],
            'patient_id' => ['required', 'numeric', Rule::exists(Patient::class, 'id')],
        ]);

        return IllnessHistory::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\IllnessHistory  $illnessHistory
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return IllnessHistory::with('patient')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\IllnessHistory  $illnessHistory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, IllnessHistory $illnessHistory)
    {
        $data = $request->validate([
            'date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'physical_exams' => ['nullable'],
            'assessment' => ['nullable', 'string'],
            'treatment' => ['nullable', 'string'],
        ]);

        $illnessHistory->update($data);

        return $illnessHistory;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\IllnessHistory  $illnessHistory
     * @return \Illuminate\Http\Response
     */
    public function destroy(IllnessHistory $illnessHistory)
    {
        $illnessHistory->delete();

        return response('', 204);
    }
}
