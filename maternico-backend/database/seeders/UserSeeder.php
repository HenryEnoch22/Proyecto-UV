<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'role_id' => 1,
            'name' => 'Javier',
            'last_name' => 'Pino ',
            'mother_last_name' => 'Herrera',
            'email' => 'jpino@gmail.com',
            'birth_date' => '1999-03-09',
            'password' => Hash::make('123456789'),
        ]);
    }
}
