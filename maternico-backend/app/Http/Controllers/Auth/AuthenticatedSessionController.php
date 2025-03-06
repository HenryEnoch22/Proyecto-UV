<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(/*Login*/Request $request)
    {
//        $request->authenticate();
//
//        $request->session()->regenerate();
//
//        return response()->noContent();
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $user = Auth::user();

//         Revoca tokens anteriores antes de generar uno nuevo
         $user->tokens()->delete();

        // Generar el token de acceso de Sanctum
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
//        Auth::guard('web')->logout();
//
//        $request->session()->invalidate();
//
//        $request->session()->regenerateToken();
//
//        return response()->noContent();


    //    Manera sencilla
//        $request->user()->tokens()->delete(); // Revocar todos los tokens del usuario
//        return response()->json(['message' => 'Sesión cerrada'], 200);

        if ($request->user()) {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
        }

        return response()->json(['message' => 'Usuario no autenticado'], 401);
    }
}
