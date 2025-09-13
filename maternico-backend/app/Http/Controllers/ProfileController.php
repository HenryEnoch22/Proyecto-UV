<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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


    public function update(UpdateProfileRequest $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $data = $request->validated();

            // Si vino foto nueva, guárdala y actualiza path
                if ($request->hasFile('profile_photo')) {
                    if (!empty($user->profile_photo_path)) {
                        Storage::disk('public')->delete($user->profile_photo_path);
                    }
                    $path = $request->file('profile_photo')->store('profile', 'public');
                    $data['profile_photo'] = $path;
                }

            $user->update([
                'name' => $data['name'] ?? $user->name,
                'email' => $data['email'] ?? $user->email,
                'last_name' => $data['last_name'] ?? $user->last_name,
                'mother_last_name' => $data['mother_last_name'] ?? $user->mother_last_name,
                'profile_photo_path' => $data['profile_photo'],
            ]);
            $user->load('baby');
            $user->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Perfil actualizado correctamente',
                'data'    => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el perfil: ' . $e->getMessage(),
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function becomePremium($userID) {
        try {
            $user = User::findOrFail($userID);
            $user->update(['is_premium' => 1]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado a premium correctamente',
                'data' => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el usuario a premium',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
