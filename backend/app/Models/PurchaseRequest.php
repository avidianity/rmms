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
        static::saving(function (self $purchaseRequest) {
            if ($purchaseRequest->delivered !== null) {
                foreach ($purchaseRequest->items as $item) {
                    $medicine = $item->medicine;
                    $medicine->stocks -= $item->quantity;
                    $medicine->save();
                }
            }
        });

        static::deleting(function (self $purchaseRequest) {
            $purchaseRequest->items()->delete();
        });
    }

    public function items()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }

    public function recordable()
    {
        return $this->morphTo();
    }
}
