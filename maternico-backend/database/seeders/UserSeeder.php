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
            [
                "id" => 1,
                'role_id' => 2,
                'name' => 'Patricia',
                'last_name' => 'Martinez',
                'mother_last_name' => 'Moreno',
                'email' => 'pmoreno@gmail.com',
                'birth_date' => '1999-03-09',
                'password' => Hash::make('123456789'),
            ],
            [
                "id" => 2,
                'role_id' => 1,
                'name' => 'Javier',
                'last_name' => 'Pino',
                'mother_last_name' => 'Herrera',
                'email' => 'jpino@gmail.com',
                'birth_date' => '1999-03-09',
                'password' => Hash::make('123456789'),
            ],
            [
                'id' => 4,
                'role_id' => 2,
                'name' => 'Abigail',
                'last_name' => 'Hernández',
                'mother_last_name' => 'García',
                'email' => 'abi@gmail.com',
                'birth_date' => '2004-03-09',
                'password' => Hash::make('123456789'),
            ],
            [
                'id' => 5,
                'role_id' => 2,
                'name' => 'Ruth',
                'last_name' => 'Picafresa',
                'mother_last_name' => 'Fonseca',
                'email' => 'ruth@gmail.com',
                'birth_date' => '2004-03-09',
                'password' => Hash::make('123456789'),
            ]
        ]);
    }
}
