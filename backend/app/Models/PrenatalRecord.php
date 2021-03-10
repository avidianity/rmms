<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrenatalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number',
        'lmp',
        'edc',
        'aog',
        'bp',
        'wt',
        'ht',
        'fht',
        'fh',
        'toxoid',
        'lab_requests',
        'feso4',
        'remarks',
        'screened_syphilis',
        'screened_hepatitis',
        'screened_hiv',
        'screened_gestational_diabetes',
        'diagnosed_anemia',
        'cbc_hgb_hct',
        'deworming_dose',
        'phic',
        'religion',
        'attendee_id',
        'patient_id',
    ];

    protected $casts = [
        'case_number' => 'datetime',
    ];

    protected $searchable = [
        'case_number',
    ];

    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->case_number = now()->format('Y-m-d');
        });
    }

    public function attendee()
    {
        return $this->belongsTo(User::class, 'attendee_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function prescriptions()
    {
        return $this->morphMany(Prescription::class, 'recordable');
    }
}
