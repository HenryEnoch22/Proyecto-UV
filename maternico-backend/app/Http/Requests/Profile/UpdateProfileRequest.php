<?php

namespace App\Http\Requests\Profile;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'lowercase', 'email', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:45'],
            'mother_last_name' => ['sometimes', 'string', 'max:45'],
            'birth_date' => ['nullable', 'date'],
            'profile_photo_path' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser un texto válido.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',
            'email.string' => 'El correo debe ser un texto válido.',
            'email.lowercase' => 'El correo debe estar en minúsculas.',
            'email.email' => 'Debe proporcionar un correo electrónico válido.',
            'email.max' => 'El correo no puede exceder los 255 caracteres.',
            'last_name.string' => 'El apellido paterno debe ser un texto válido.',
            'last_name.max' => 'El apellido paterno no puede exceder los 45 caracteres.',
            'mother_last_name.string' => 'El apellido materno debe ser un texto válido.',
            'mother_last_name.max' => 'El apellido materno no puede exceder los 45 caracteres.',
            'birth_date.date' => 'La fecha de nacimiento debe ser una fecha válida.',
            'profile_photo_path.image' => 'La foto de perfil debe ser una imagen válida.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Errores de validación',
            'errors' => $validator->errors()
        ], 422));
    }
}
