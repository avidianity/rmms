<?php

namespace App\Models;

use App\Casts\FloatingPoint;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'cost', 'stocks'];

    protected $casts = ['cost' => FloatingPoint::class];

    protected $searchable = ['name'];
}
