<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Baby extends Model
{
    use HasFactory;

    protected $fillable = [
        'attendee_id',
        'name',
        'nickname',
        'father',
        'mother',
        'type_of_birth',
        'date_of_birth',
        'sex',
        'complete_in_months',
        'single_or_twin',
        'blood_type',
        'weight',
        'length_of_body',
        'head_measurement',
        'chest_measurement',
        'order_of_birth',
        'name_registration_date',
        'name_registration_location',
        'mishaps',
    ];

    protected $casts = [
        'date_of_birth' => 'datetime',
        'complete_in_months' => 'boolean',
        'name_registration_date' => 'datetime',
    ];

    protected $searchable = [
        'name',
        'nickname',
        'father',
        'mother',
        'type_of_birth',
        'single_or_twin',
        'mishaps',
    ];

    protected static function booted()
    {
        static::deleting(function (self $baby) {
            $baby->vaccinations()->delete();
        });
    }

    public function attendee()
    {
        return $this->belongsTo(User::class, 'attendee_id');
    }

    public function vaccinations()
    {
        return $this->hasMany(BabyVaccination::class);
    }
}
