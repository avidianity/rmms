<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    protected $searchable = [
        'name',
    ];

    protected $fillable = [
        'name',
        'age',
        'sex',
        'birthday',
        'address',
        'civil_status',
        'membership_nh',
        'membership_nn',
        'philhealth_number',
        'contact_number',
        'phic',
        '4ps',
        'blood_type',
        'religion',
    ];

    protected static function booted()
    {
        static::deleting(function (self $patient) {
            $patient->records()->delete();
            $patient->prenatals()->delete();
        });
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function prenatals()
    {
        return $this->hasMany(PrenatalRecord::class);
    }
}
