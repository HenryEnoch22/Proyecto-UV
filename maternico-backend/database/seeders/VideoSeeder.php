<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('videos')->insert([
            [
                'title' => 'Video 1',
                'video_path' => 'https://drive.google.com/file/d/1ULrbWaGbcXXYs4rF283CdV2XespjisQ1/view?usp=sharing',
            ],
            [
                'title' => 'Video 2',
                'video_path' => 'https://drive.google.com/file/d/1Fik9MqAt17gM1Ui4xhzeMuqCQxwZBKHd/view?usp=drive_link',
            ],
            [
                'title' => 'Video 3',
                'video_path' => 'https://drive.google.com/file/d/1ewbMWU5F7uGdE0LtKezydrs8onhgBzo7/view?usp=drive_link',
            ],
            [
                'title' => 'Video 4',
                'video_path' => 'https://drive.google.com/file/d/1f7rMIsUW1b_maQ_hAngGbS1W-WiBtt_L/view?usp=drive_link',
            ],
        ]);
    }
}
