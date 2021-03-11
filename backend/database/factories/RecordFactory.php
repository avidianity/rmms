<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\Record;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class RecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Record::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'case_number' => $this->faker->dateTime->format('Y-m-d'),
            'diagnosis' => $this->faker->text(255),
            'doctor_id' => User::doctor()->inRandomOrder()->firstOrFail()->id,
            'patient_id' => Patient::inRandomOrder()->firstOrFail()->id,
            'status' => ['Pending', 'Done'][$this->faker->numberBetween(0, 1)],
            'created_at' => Carbon::parse($this->faker->dateTime)->year(now()->year),
        ];
    }
}
