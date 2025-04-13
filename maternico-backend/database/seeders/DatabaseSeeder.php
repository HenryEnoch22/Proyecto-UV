<?php

namespace Database\Seeders;

use App\Models\Baby\BabyEvent;
use App\Models\Event\Event;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            HealthCenterSeeder::class,
            MagazineSeeder::class,
            BabySeeder::class,
            BabyEventSeeder::class,
            ForumSeeder::class,
            CommentSeeder::class,
            EventSeeder::class,
            VideoSeeder::class,
        ]);
        // User::factory(10)->create();

//        User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);
    }
}
