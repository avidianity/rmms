<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'released_at',
        'doctor_id',
    ];

    protected $casts = [
        'released_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::deleting(function (self $prescription) {
            $prescription->items()->delete();
        });
    }

    public function recordable()
    {
        return $this->morphTo();
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function items()
    {
        return $this->hasMany(PrescriptionItem::class);
    }
}