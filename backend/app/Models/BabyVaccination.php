<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BabyVaccination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'doses',
        'date',
        'remarks',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function baby()
    {
        return $this->belongsTo(Baby::class);
    }
}
