<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class PurchaseRequestController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return PurchaseRequest::paginate(15);
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
            'pr_number' => ['nullable', 'string', 'max:255'],
            'sai_number' => ['nullable', 'string', 'max:255'],
            'obr_number' => ['nullable', 'string', 'max:255'],
            'delivered' => ['nullable', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'items.*.quantity' => ['required', 'numeric'],
        ]);

        /**
         * @var PurchaseRequest
         */
        $purchaseRequest = PurchaseRequest::create($data);

        if (Arr::has($data, 'items')) {
            $this->saveItems($purchaseRequest, $data);
        }

        $purchaseRequest->checkStocks();

        $purchaseRequest->load('items.medicine');

        return $purchaseRequest;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return PurchaseRequest::with(
            'items.medicine'
        )->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        $data = $request->validate([
            'pr_number' => ['nullable', 'string', 'max:255'],
            'sai_number' => ['nullable', 'string', 'max:255'],
            'obr_number' => ['nullable', 'string', 'max:255'],
            'delivered' => ['nullable', 'date'],
            'items' => ['nullable', 'array'],
            'items.*.medicine_id' => ['nullable', 'numeric', Rule::exists(Medicine::class, 'id')],
            'items.*.quantity' => ['nullable', 'numeric'],
        ]);

        if (Arr::has($data, 'items')) {
            $purchaseRequest->items()->delete();
            $this->saveItems($purchaseRequest, $data);
        }

        $purchaseRequest->update($data);

        $purchaseRequest->load('items.medicine');

        return $purchaseRequest;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PurchaseRequest  $purchaseRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->delete();

        return response('', 204);
    }

    protected function saveItems($purchaseRequest, $data)
    {
        $purchaseRequest->items()->createMany($data['items']);
    }
}
