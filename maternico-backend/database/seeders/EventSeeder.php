<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('events')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'event_title' => 'Cita con el pediatra',
                'type' => 'Cita médica',
                'date' => '2025-03-20',
                'time' => '10:00',
                'notifiable' => 1,
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'event_title' => 'Vacuna contra la influenza',
                'type' => 'Vacunación',
                'date' => '2025-03-28',
                'time' => '8:00',
                'notifiable' => 1,
            ],
            [
                'id' => 3,
                'user_id' => 1,
                'event_title' => 'Tu bebé ya puede comer algunos alimentos sólidos',
                'type' => 'Alimentación',
                'date' => '2025-03-31',
                'time' => '8:00',
                'notifiable' => 0,
            ],
            [
                'id' => 4,
                'user_id' => 1,
                'event_title' => 'Cumpleaños de tu bebé',
                'type' => 'Cumpleaños',
                'date' => '2025-04-01',
                'time' => '8:00',
                'notifiable' => 1,
            ],
        ]);
    }
}
