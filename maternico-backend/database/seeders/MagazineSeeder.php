<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MagazineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('magazines')->insert([
            [
                'title' => 'Revista 0 a 1 Año',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/EVx_lYTzgHVJjEKI1Bom8vEBksmnAv3MmDRegQjPvsquGw?e=4thEJ2',
            ],
            [
                'title' => 'Revista 1 Año',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/EVRMKMKlRbJOthVWblxPOxQB3vWWrSloAXFvlE2SZOCQ7A?e=JBq7Qw',
            ],
            [
                'title' => 'Revista 2 Años',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/EZe-QLg-8sRIqFuO36B2lDcBGyVOQA22YKFJVdyzRbmNag?e=FHRdcC',
            ],
            [
                'title' => 'Revista 3 Años',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/Ea-8L6WNIPtGuJnZswkcFJMBYTMeNb69wKW8k4oY9487kQ?e=E5V8dQ',
            ],
            [
                'title' => 'Revista 4 Años',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/ESyjj58iwv5Nvd4ftOymEw8BTUb5wgozpv0KXPi01Sh-CQ?e=ioLgIY',
            ],
            [
                'title' => 'Revista 5 Años',
                'magazine_path' => 'https://uvmx-my.sharepoint.com/:b:/g/personal/zs22017027_estudiantes_uv_mx/EQl-doPGpeFBudEKhCXJH4MBdkieiQsyqDPPBojlqpnqrg?e=8LE29Y',
            ],
        ]);
    }
}
