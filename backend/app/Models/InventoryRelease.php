<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryRelease extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'quantity', 'date'];

    protected static function booted()
    {
        static::deleting(function (self $inventoryRelease) {
            $inventoryRelease->inventory->delete();
        });
    }

    public static function search($keyword)
    {
        return static::whereHas('inventory', function (Builder $query) use ($keyword) {
            $query->where('description', 'LIKE', "%{$keyword}%");
        })
            ->orWhere('name', 'LIKE', "%{$keyword}%");
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}
