<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model as BaseModel;

class Model extends BaseModel
{
    use HasFactory;

    protected $searchable = [];

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
}
