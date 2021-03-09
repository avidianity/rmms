<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrescriptionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'prescription_id',
        'quantity',
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }
}
