<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('comments')->insert([
            [
                'id' => 1,
                'user_id' => 4,
                'forum_id' => 1,
                'text' => 'Uno de los mejores consejos que recibí fue dormir cuando el bebé duerme.'
            ],
            [
                'id' => 2,
                'user_id' => 5,
                'forum_id' => 1,
                'text' => 'Tener un buen grupo de apoyo hace toda la diferencia en la maternidad.'
            ],
            [
                'id' => 3,
                'user_id' => 5,
                'forum_id' => 2,
                'text' => 'Al principio puede ser difícil, pero con paciencia todo mejora.'
            ],
            [
                'id' => 4,
                'user_id' => 1,
                'forum_id' => 2,
                'text' => 'Recomiendo buscar asesoría de lactancia para evitar problemas como mastitis.',
            ]
        ]);
    }
}
