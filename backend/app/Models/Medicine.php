<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'number_of_units',
        'unit_of_issue',
        'estimated_unit_cost',
        'quantity',
        'date_delivered',
        'expiry_date',
        'critical_value',
    ];

    protected $casts = [
        'date_delivered' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    protected $appends = ['released', 'available', 'estimated_cost'];

    protected $searchable = ['description'];

    protected static function booted()
    {
        static::deleting(function (self $medicine) {
            $medicine->items()->delete();
        });
    }

    public function getReleasedAttribute()
    {
        $released = 0;

        foreach ($this->prescriptions as $item) {
            if ($item->prescription->released) {
                $released += $item->quantity;
            }
        }

        return $released;
    }

    public function getEstimatedCostAttribute()
    {
        return $this->number_of_units * $this->estimated_unit_cost;
    }

    public function getAvailableAttribute()
    {
        return $this->quantity - $this->released;
    }

    public function items()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(PrescriptionItem::class);
    }
}
