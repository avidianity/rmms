<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create(['email' => 'admin@rmms.com', 'password' => Hash::make('admin'), 'role' => 'Admin']);
        User::factory()->create(['email' => 'doctor@rmms.com', 'password' => Hash::make('doctor'), 'role' => 'Doctor']);
        User::factory()->create(['email' => 'nurse@rmms.com', 'password' => Hash::make('nurse'), 'role' => 'Nurse']);
        User::factory()->create(['email' => 'pharmacist@rmms.com', 'password' => Hash::make('pharmacist'), 'role' => 'Pharmacist']);
    }
}
