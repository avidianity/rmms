<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\PersonalAccessToken as Model;

class Token extends Model
{
    protected $table = 'personal_access_tokens';

    use HasFactory;
}
