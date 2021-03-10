<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PatientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Patient::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'age' => $this->faker->numberBetween(15, 60),
            'birthday' => $this->faker->dateTime(),
            'address' => $this->faker->address,
            'blood_type' => $this->faker->bloodType,
            'sex' => ['Male', 'Female'][$this->faker->numberBetween(0, 1)],
            'created_at' => Carbon::parse($this->faker->dateTime)->year(now()->year),
        ];
    }
}
