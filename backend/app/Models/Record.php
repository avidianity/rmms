<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Record extends Model
{
    use HasFactory;

    protected $fillable = [
        'diagnosis',
        'doctor_id',
        'patient_id',
    ];

    protected $casts = [
        'case_number' => 'datetime',
    ];

    protected $searchable = ['case_number'];

    protected static function booted()
    {
        static::creating(function (self $record) {
            $record->case_number = now();
        });

        static::deleting(function (self $record) {
            $record->requests()->delete();
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

    public function requests()
    {
        return $this->morphMany(PurchaseRequest::class, 'recordable');
    }
}
