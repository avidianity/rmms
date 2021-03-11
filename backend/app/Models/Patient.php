<?php

namespace App\Models;

use App\Casts\Date;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    protected $searchable = [
        'name',
        'address',
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
        '4ps',
        'blood_type',
    ];

    protected $casts = [
        'birthday' => Date::class,
    ];

    protected static function booted()
    {
        static::deleting(function (self $patient) {
            $patient->records()->delete();
            $patient->prenatals()->delete();
            $patient->histories()->delete();
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

    public function scopeMale($query)
    {
        return $query->where('sex', 'Male');
    }

    public function scopeFemale($query)
    {
        return $query->where('sex', 'Female');
    }

    public function histories()
    {
        return $this->hasMany(IllnessHistory::class);
    }
}
