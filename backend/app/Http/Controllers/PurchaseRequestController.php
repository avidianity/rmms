<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\PrenatalRecord;
use App\Models\PurchaseRequest;
use App\Models\PurchaseRequestItem;
use App\Models\Record;
use App\Rules\DynamicModelExists;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class PurchaseRequestController extends Controller
{
    protected $map = [
        'prenatal' => PrenatalRecord::class,
        'regular' => Record::class,
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return PurchaseRequest::with([
            'items.medicine',
            'recordable',
        ])->paginate(15);
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
            'recordable_type' => ['required', 'string', Rule::in(array_keys($this->map))],
            'recordable_id' => ['required', 'numeric', new DynamicModelExists($this->map, 'recordable_type')],
            'items' => ['nullable', 'array'],
            'items.*.medicine_id' => ['required', 'numeric', Rule::exists(Medicine::class, 'id')],
            'items.*.quantity' => ['required', 'numeric'],
        ]);

        $class = $this->map[$data['recordable_type']];

        /**
         * @var Record|PrenatalRecord
         */
        $model = $class::findOrFail($data['recordable_id']);

        /**
         * @var PurchaseRequest
         */
        $purchaseRequest = $model->requests()->create($data);

        $items = collect($data['items'])->map(function ($row) {
            return new PurchaseRequestItem($row);
        });

        $purchaseRequest->items()->createMany($items);

        $purchaseRequest->load('items.medicine', 'recordable');

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
        return PurchaseRequest::with([
            'items.medicine',
            'recordable',
        ])->findOrFail($id);
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

        $purchaseRequest->update($data);

        if (Arr::has($data, 'items')) {
            $purchaseRequest->items()->delete();

            $items = collect($data['items'])->map(function ($row) {
                return new PurchaseRequestItem($row);
            });

            $purchaseRequest->items()->createMany($items);
        }

        $purchaseRequest->load('items.medicine', 'recordable');

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
}
