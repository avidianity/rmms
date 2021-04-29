<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Str;

class Record extends Model
{
    use HasFactory;

    protected $fillable = [
        'diagnosis',
        'doctor_id',
        'patient_id',
        'status',
    ];

    protected $casts = [
        'case_number' => 'datetime',
    ];

    public static function search($keyword)
    {
        return static::whereHas('doctor', function (Builder $query) use ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        })->orWhereHas('patient', function (Builder $query) use ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        });
    }

    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->case_number = now()->format('Y-m-d');
        });

        static::saving(function (self $record) {
            $record->status = trim($record->diagnosis) === '' ? 'Pending' : 'Done';
        });
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function prescriptions()
    {
        return $this->morphMany(Prescription::class, 'recordable');
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
