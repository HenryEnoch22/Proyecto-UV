<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Health\HealthCenter;
use App\Models\Locality;

class HealthCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Centros de salud obtenidos correctamente',
            'data' => HealthCenter::where('state', 'San Luis Potosí')
                ->limit(7)
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getNearbyHealthCenters(Request $request)
    {
        $state = $request->query('state');
        $city = $request->query('city');

        if (!$state || !$city) {
            return response()->json([
                'success' => false,
                'message' => 'Se requieren estado y ciudad'
            ], 400);
        }

        $healthCenters = HealthCenter::where('state', $state)
            ->where('city', $city)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $healthCenters,
            'count' => $healthCenters->count()
        ]);
    }

    private function findUserLocality($userLat, $userLng)
    {
        \Log::info([
            'method' => 'findUserLocality',
        ]);

        $localities = Locality::all();
        $closestLocality = null;
        $minDistance = PHP_FLOAT_MAX;

        foreach ($localities as $locality) {
            $distance = $this->calculateDistance(
                $userLat, $userLng,
                $locality->latitude_decimal, $locality->longitude_decimal
            );

            if ($distance < $minDistance) {
                $minDistance = $distance;
                $closestLocality = $locality;
            }
        }

        if ($closestLocality) {
            return [
                'state' => $closestLocality->state_name,
                'municipality' => $closestLocality->municipality_name,
                'locality' => $closestLocality->locality_name,
                'distance_km' => round($minDistance, 1)
            ];
        }

        return null;
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        \Log::info([
            'method' => 'calculateDistance',
        ]);
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat/2) * sin($dLat/2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon/2) * sin($dLon/2);

        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }
}
