<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model as BaseModel;

class Model extends BaseModel
{
    protected $searchable = [];

    public function getSearchableColumns()
    {
        return $this->searchable;
    }

    /**
     *
     * @return static
     */
    public static function search($keyword)
    {
        $builder = null;

        foreach ((new static())->getSearchableColumns() as $column) {
            $builder = $builder !== null ? $builder->orWhere($column, 'LIKE', "%{$keyword}%") : static::where($column, 'LIKE', "%{$keyword}%");
        }

        return $builder;
    }
}
