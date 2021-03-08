<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Arr;

class DynamicModelExists implements Rule
{
    /**
     * @var string[]
     */
    protected $map;

    /**
     * @var string
     */
    protected $column;

    /**
     * Create a new rule instance.
     *
     * @param string[] $map
     * @param string $key
     * @param string $column
     * @return void
     */
    public function __construct($map, $key, $column = 'id')
    {
        $this->map = $map;
        $this->column = $column;
        $this->key = $key;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $model = $this->getModel();

        if (!class_exists($model)) {
            return false;
        }
        return $model::where($this->column, $value)->count() !== 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        $model = $this->getModel();

        if (!class_exists($model)) {
            return 'Model does not exist.';
        }

        $fragments = explode('\\', $model);

        $name = $fragments[count($fragments) - 1];

        return "{$name} does not exist.";
    }

    /**
     * Get the model class name
     * 
     * @return string
     */
    protected function getModel()
    {
        $key = request($this->key);
        if (!Arr::exists($this->map, $key)) {
            return '';
        }
        return $this->map[$key];
    }
}
