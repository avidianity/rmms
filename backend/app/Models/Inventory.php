<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'unit_of_issue',
        'estimated_unit_cost',
        'quantity',
        'released',
        'available',
        'date_delivered',
        'expiry_date',
    ];

    protected $casts = [
        'date_delivered' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    protected $searchable = ['name'];
}
