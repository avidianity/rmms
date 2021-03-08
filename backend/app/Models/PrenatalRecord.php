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
            $record->case_number = now();
        });

        static::deleting(function (self $record) {
            $record->requests()->delete();
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

    public function requests()
    {
        return $this->morphMany(PurchaseRequest::class, 'recordable');
    }
}
