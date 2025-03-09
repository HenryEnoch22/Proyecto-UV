<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HealthCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('health_centers')->insert([
            [
                'name' => 'Hospital Materno Infantil de Coatzacoalcos',
                'address' => 'Avenida José Lemarroy, frente al fraccionamiento Puerto Esmeralda',
                'city' => 'Coatzacoalcos',
                'state' => 'Veracruz',
                'phone_number' => 'No disponible',
            ],
            [
                'name' => 'Hospital Regional de Coatzacoalcos "Valentín Gómez Farías"',
                'address' => 'Av. Universidad Veracruzana S/N, Col. Santa Isabel',
                'city' => 'Coatzacoalcos',
                'state' => 'Veracruz',
                'phone_number' => '921 211 3500',
            ],
            [
                'name' => 'Centro de Salud de Cosoleacaque',
                'address' => 'Calle Benito Juárez 123, Col. Centro',
                'city' => 'Cosoleacaque',
                'state' => 'Veracruz',
                'phone_number' => '922 123 4567',
            ],
            [
                'name' => 'Centro de Salud de Chinameca',
                'address' => 'Avenida Hidalgo 456, Col. Centro',
                'city' => 'Chinameca',
                'state' => 'Veracruz',
                'phone_number' => '922 234 5678',
            ],
            [
                'name' => 'Centro de Salud de Jáltipan',
                'address' => 'Calle Morelos 789, Col. Centro',
                'city' => 'Jáltipan',
                'state' => 'Veracruz',
                'phone_number' => '922 345 6789',
            ],
            [
                'name' => 'Centro de Salud de Oteapan',
                'address' => 'Calle Independencia 101, Col. Centro',
                'city' => 'Oteapan',
                'state' => 'Veracruz',
                'phone_number' => '922 456 7890',
            ],
            [
                'name' => 'Centro de Salud de Zaragoza',
                'address' => 'Calle 5 de Mayo 202, Col. Centro',
                'city' => 'Zaragoza',
                'state' => 'Veracruz',
                'phone_number' => '922 567 8901',
            ],
            [
                'name' => 'Centro de Salud de Pajapan',
                'address' => 'Calle Juárez 303, Col. Centro',
                'city' => 'Pajapan',
                'state' => 'Veracruz',
                'phone_number' => '922 678 9012',
            ],
            [
                'name' => 'Centro de Salud de Mecayapan',
                'address' => 'Calle Hidalgo 404, Col. Centro',
                'city' => 'Mecayapan',
                'state' => 'Veracruz',
                'phone_number' => '922 789 0123',
            ],
            [
                'name' => 'Centro de Salud de Soteapan',
                'address' => 'Calle Allende 505, Col. Centro',
                'city' => 'Soteapan',
                'state' => 'Veracruz',
                'phone_number' => '922 890 1234',
            ],
        ]);
    }
}
