<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Builder;
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
        'status',
        'attendee_id',
        'patient_id',
        'husband',
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

        static::saving(function (self $record) {
            $record->status = empty(trim($record->remarks ? $record->remarks : '')) || $record->remarks === 'N/A' ? 'Pending' : 'Done';
        });
    }

    public static function search($keyword)
    {
        return static::whereHas('attendee', function (Builder $query) use ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        })->orWhereHas('patient', function (Builder $query) use ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
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
