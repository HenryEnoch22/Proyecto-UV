<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class IndexEventRequest extends FormRequest
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
            'user_id' => ['required', 'exists:users,id'],
            'year' => ['required', 'integer', 'digits:4'],
            'month' => ['required', 'integer', 'between:1,12'],
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'El campo user_id es obligatorio.',
            'user_id.exists' => 'El usuario no existe en la base de datos.',
            'year.required' => 'El año es obligatorio.',
            'year.integer' => 'El año debe ser un número entero.',
            'year.digits' => 'El año debe tener 4 dígitos.',
            'month.required' => 'El mes es obligatorio.',
            'month.integer' => 'El mes debe ser un número entero.',
            'month.between' => 'El mes debe estar entre 1 y 12.',
        ];
    }

    /**
     * Sobreescribir respuesta de validación para devolver JSON.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Errores de validación',
            'errors' => $validator->errors(),
        ], 422));
    }
}
