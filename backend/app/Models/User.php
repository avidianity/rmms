<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    const ROLES = [
        'Admin',
        'Doctor',
        'Nurse',
        'Pharmacist',
        'Midwife',
    ];

    protected $searchable = ['name'];

    protected $with = ['picture'];

    public function picture()
    {
        return $this->belongsTo(File::class, 'profile_picture_id');
    }

    public function getSearchableColumns()
    {
        return $this->searchable;
    }

    public static function search($keyword)
    {
        $builder = new static();

        foreach ($builder->getSearchableColumns() as $column) {
            $builder = $builder->orWhere($column, 'LIKE', "%{$keyword}%");
        }

        return $builder;
    }

    public function isAdmin()
    {
        return $this->role === 'Admin';
    }

    public function records()
    {
        return $this->hasMany(Record::class, 'doctor_id');
    }

    public function prenatals()
    {
        return $this->hasMany(PrenatalRecord::class, 'prenatal_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'doctor_id');
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', 'Admin');
    }

    public function scopeDoctor($query)
    {
        return $query->where('role', 'Doctor');
    }

    public function scopePharmacist($query)
    {
        return $query->where('role', 'Pharmacist');
    }

    public function scopeNurse($query)
    {
        return $query->where('role', 'Nurse');
    }
}
