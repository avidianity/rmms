<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
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

    public function getReleasedAttribute()
    {
        return $this->releases->map(function (InventoryRelease $inventoryRelease) {
            return $inventoryRelease->quantity;
        })
            ->reduce(function ($previous, $next) {
                return $previous + $next;
            }, 0);
    }

    public function getEstimatedCostAttribute()
    {
        return $this->number_of_units * $this->estimated_unit_cost;
    }

    public function getAvailableAttribute()
    {
        return $this->quantity - $this->released;
    }

    public function releases()
    {
        return $this->hasMany(InventoryRelease::class);
    }
}
