<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Locality;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'last_name' => ['required', 'string', 'max:45'],
            'mother_last_name' => ['required', 'string', 'max:45'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_rural' => ['required', 'boolean'],
            'user_lat' => ['required', 'numeric'],
            'user_lng' => ['required', 'numeric'],
            'locality_state' => ['required_if:is_rural,true', 'string'],
            'locality_municipality' => ['required_if:is_rural,true', 'string'],
            'locality_name' => ['required_if:is_rural,true', 'string'],
        ]);

        $locality_id = null;
        $is_premium = 0;

        if ($request->is_rural) {
            $localities = Locality::where('state_name', $request->locality_state)
                ->where('municipality_name', $request->locality_municipality)
                ->where('locality_name', $request->locality_name)
                ->get();

            if ($localities->isEmpty()) {
                return response()->json([
                    'message' => 'No se encontraron localidades que coincidan con los datos proporcionados.',
                    'errors' => ['locality' => ['Localidad no encontrada']]
                ], 422);
            }

            $maxDistanceKm = 5;
            $localityFound = false;

            foreach ($localities as $locality) {
                $distance = $this->haversine(
                    $request->user_lat, 
                    $request->user_lng,
                    $locality->latitude_decimal, 
                    $locality->longitude_decimal
                );

                if ($distance <= $maxDistanceKm) {
                    $locality_id = $locality->id;
                    $is_premium = 1;
                    $localityFound = true;
                    break;
                }
            }

            if (!$localityFound) {
                return response()->json([
                    'message' => 'Tu ubicación actual no coincide con la localidad seleccionada. Debes estar dentro de un radio de 5km de la localidad rural.',
                    'errors' => ['location' => ['Ubicación no válida para la localidad seleccionada']]
                ], 422);
            }
        }

        $user = User::create([
            'role_id' => 2,
            'name' => $request->name,
            'last_name' => $request->last_name,
            'mother_last_name' => $request->mother_last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'locality_id' => $locality_id,
            'is_premium' => $is_premium,
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('API Token')->plainTextToken,
        ], 201);
    }

    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
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
