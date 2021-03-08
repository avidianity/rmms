<?php

namespace Database\Factories;

use App\Models\Medicine;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicineFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Medicine::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->title,
            'unit_of_issue' => $this->faker->word(1),
            'cost' => $this->faker->numberBetween(0, 500),
            'stocks' => $this->faker->numberBetween(0, 100),
        ];
    }
}
