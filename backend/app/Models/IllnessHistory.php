<?php

namespace App\Models;

use App\Casts\JSON;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IllnessHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'physical_exams',
        'patient_id',
        'chief_complaint',
    ];

    protected $casts = [
        'physical_exams' => JSON::class,
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
