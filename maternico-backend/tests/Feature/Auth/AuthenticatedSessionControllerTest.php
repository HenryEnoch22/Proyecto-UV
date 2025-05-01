<?php

namespace Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticatedSessionControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_can_login_with_correct_credentials()
    {
        // Crear usuario real
        $user = User::factory()->create([
            'name' => 'Sofía',
            'last_name' => 'López',
            'mother_last_name' => 'Martínez',
            'birth_date' => '1995-03-10',
            'email' => 'sofia@example.com',
            'password' => Hash::make('12345678'),
            'profile_photo_path' => null,
            'role_id' => 2,
        ]);
        $response = $this->postJson('/login', [
            'email' => 'sofia@example.com',
            'password' => '12345678',
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
            ],
        ]);
    }

    public function test_login_fails_with_wrong_password()
    {
        $user = User::factory()->create([
            'name' => 'Ana',
            'last_name' => 'López',
            'mother_last_name' => 'Martínez',
            'birth_date' => '1995-03-10',
            'email' => 'ana@example.com',
            'password' => Hash::make('12345678'),
            'profile_photo_path' => null,
            'role_id' => 2,
        ]);

        $response = $this->postJson('/login', [
            'email' => 'ana@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401); // Unauthorized
        $response->assertJson([
            'message' => 'Credenciales incorrectas',
        ]);
    }

    public function test_login_fails_when_email_does_not_exist()
    {
        $response = $this->postJson('/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'irrelevant',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Credenciales incorrectas',
        ]);
    }


    // LOGOUT

    public function test_user_can_logout_successfully()
    {
        $user = \App\Models\User::factory()->create([
            'name' => 'Noemi',
            'last_name' => 'Nieves',
            'mother_last_name' => 'Martínez',
            'birth_date' => '1995-03-10',
            'email' => 'nohemi@example.com',
            'password' => Hash::make('12345678'),
            'profile_photo_path' => null,
            'role_id' => 2,
        ]);
        $token = $user->createToken('API Token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }


    public function test_logout_fails_when_user_is_not_authenticated()
    {
        $response = $this->postJson('/logout');

        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Unauthenticated.',
        ]);
    }
}
