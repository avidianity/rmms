<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property Medicine $medicine
 */
class PurchaseRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'purchase_request_id',
        'quantity',
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function request()
    {
        return $this->belongsTo(PurchaseRequest::class);
    }
}
