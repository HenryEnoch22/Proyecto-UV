<?php

namespace Auth;

use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegisteredUserControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_can_register_successfully()
    {
        $response = $this->postJson('/register', [
            'name' => 'Maria Teresa',
            'last_name' => 'Pérez',
            'mother_last_name' => 'Cruz',
            'email' => 'maria@gmail.com',
            'password' => '123456789',
            'password_confirmation' => '123456789',
        ]);
        $response->assertCreated(); // Status 201
        $response->assertJsonStructure([
            'user' => [
                'id',
                'role_id',
                'name',
                'last_name',
                'mother_last_name',
                'email',
            ],
            'token',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'maria@gmail.com',
            'name' => 'Maria Teresa',
        ]);
    }

    public function test_registration_fails_with_invalid_email()
    {
        $response = $this->postJson('/register', [
            'name' => 'Gabriela',
            'last_name' => 'Kristel',
            'mother_last_name' => 'Cruz',
            'email' => 'gabriela.gmail.com', // inválido
            'password' => '123456789',
            'password_confirmation' => '123456789',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_registration_fails_when_passwords_do_not_match()
    {
        $response = $this->postJson('/register', [
            'name' => 'Yesenia',
            'last_name' => 'Rodriguez',
            'mother_last_name' => 'Moreno',
            'email' => 'yesenia@gmail.com',
            'password' => '12345678',
            'password_confirmation' => '12356789', // no coincide
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    public function test_registration_fails_with_missing_fields()
    {
        $response = $this->postJson('/register', []); // Enviar sin datos

        $response->assertStatus(422); // Unprocessable Entity
        $response->assertJsonValidationErrors([
            'name', 'email', 'last_name', 'mother_last_name', 'password',
        ]);
    }

    public function test_registration_fails_with_duplicate_email()
    {
        // Crear el usuario existente con todos sus campos
        \App\Models\User::factory()->create([
            'role_id' => 2,
            'name' => 'Laura',
            'last_name' => 'García',
            'mother_last_name' => 'Hernández',
            'birth_date' => '1990-04-25',
            'email' => 'laura.garcia@example.com',
            'password' => Hash::make('123456789'),
            'profile_photo_path' => null,
        ]);
        // Intentar registrarse con el mismo correo
        $response = $this->postJson('/register', [
            'name' => 'Laura',
            'last_name' => 'García',
            'mother_last_name' => 'Hernández',
            'email' => 'laura.garcia@example.com',
            'password' => '123456789',
            'password_confirmation' => '123456789',
        ]);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
