<?php

namespace App\Models;

use App\Casts\FloatingPoint;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit_of_issue',
        'cost',
        'stocks',
    ];

    protected $casts = [
        'cost' => FloatingPoint::class,
    ];

    protected $searchable = ['name'];

    protected static function booted()
    {
        static::deleting(function (self $medicine) {
            $medicine->items()->delete();
        });
    }

    public function items()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }
}
