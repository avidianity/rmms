<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property PurchaseRequestItem[] $items
 */
class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'pr_number',
        'sai_number',
        'obr_number',
        'delivered',
    ];

    protected $casts = [
        'delivered' => 'datetime',
    ];

    protected static function booted()
    {
        static::saved(function (self $purchaseRequest) {
            $purchaseRequest->checkStocks();
        });

        static::deleting(function (self $purchaseRequest) {
            $purchaseRequest->items()->delete();
        });
    }

    public function checkStocks()
    {
        if ($this->delivered !== null && $this->isDirty()) {
            foreach ($this->items as $item) {
                $medicine = $item->medicine;
                $medicine->stocks += $item->quantity;
                $medicine->save();
            }
        }
    }

    public function items()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }
}
