<?php

namespace App\Models;

use App\Casts\JSON;
use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IllnessHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'description',
        'physical_exams',
        'assessment',
        'treatment',
        'patient_id',
    ];

    protected $casts = [
        'date' => 'datetime',
        'physical_exams' => JSON::class,
    ];

    protected $searchable = [
        'description',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
