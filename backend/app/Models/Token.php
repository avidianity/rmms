<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as Model;

class Token extends Model
{
    protected $table = 'personal_access_tokens';
}
