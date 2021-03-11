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

    protected $appends = ['released'];

    public static function search($keyword)
    {
        return static::whereHas('doctor', function ($query) use ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        })
            ->orWhereHas('recordable.patient', function ($query) use ($keyword) {
                $query->where('name', 'LIKE', "%{$keyword}%");
            });
    }

    protected static function booted()
    {
        static::saving(function (self $prescription) {
            if ($prescription->isDirty(['released_at']) && $prescription->released_at !== null) {
                foreach ($prescription->items as $item) {
                    $medicine = $item->medicine;
                    $medicine->stocks -= $item->quantity;
                    $medicine->save();
                }
            }
        });

        static::deleting(function (self $prescription) {
            $prescription->items()->delete();
        });
    }

    public function getReleasedAttribute()
    {
        return $this->isReleased();
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

    public function isReleased()
    {
        return $this->released_at !== null;
    }
}
