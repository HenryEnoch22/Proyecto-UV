<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BabySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('babies')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'name' => 'Alexis Yahir',
                'last_name' => 'Nava',
                'mother_last_name' => 'Moreno',
                'weight' => '4 kg',
                'height' => '45cm',
                'birth_date' => '2024-11-09',
                'blood_type' => "A+",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
