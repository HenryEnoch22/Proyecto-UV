<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BabyEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('baby_events')->insert([
            [
                'id' => 1,
                'baby_id' => 1,
                'event_title' => "Aprendió a gatear",
                "description" => "Gateo del sillon a la mesa de centro",
                "date" => "2025-02-09",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'baby_id' => 1,
                'event_title' => "Dijo su primera palabra",
                "description" => "Dijo mamá mientras se despertaba de una siesta",
                "date" => "2025-03-10",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'baby_id' => 1,
                'event_title' => "Empezó a jugar con sus juguetes",
                "description" => "Se amntuvo jugando con su pelotita durante toda la tarde",
                "date" => "2025-03-11",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
