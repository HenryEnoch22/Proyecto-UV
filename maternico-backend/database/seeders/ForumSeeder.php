<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('forums')->insert([
             [
                    'id' => 1,
                    'user_id' => 1,
                    'title' => 'Consejos para nuevas madres',
                    'text' => '¿Cuáles son los mejores consejos que recibieron como madres primerizas?',
                ],
                [
                    'id' => 2,
                    'user_id' => 4,
                    'title' => 'Lactancia materna: Experiencias y consejos',
                    'text' => 'Compartamos nuestras experiencias sobre la lactancia materna.',
                ],

         ]);
    }
}
