<?php

namespace App\Models;

use App\Casts\JSON;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ImmunizationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'birthday',
        'outcome',
        'address',
        'weight',
        'nbs',
        'mother',
        'father',
        'tt_injection',
        'time_of_del',
        'type_of_del',
        'place_of_del',
        'info',
    ];

    protected $casts = [
        'birthday' => 'datetime',
        'info' => JSON::class,
    ];
}
