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
        $email = 'admin@rmms.com';
        User::where('email', $email)->delete();
        User::create(['email' => $email, 'password' => Hash::make('admin'), 'role' => 'Admin', 'name' => 'John Doe']);
    }
}
