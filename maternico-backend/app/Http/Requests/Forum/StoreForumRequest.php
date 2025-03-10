<?php

namespace App\Http\Requests\Forum;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreForumRequest extends FormRequest
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
            'title'   => ['required', 'string', 'max:255'],
            'text'    => ['required', 'string', 'min:10', 'max:1000'], // `MEDIUMTEXT` permite hasta 16,777,215 caracteres
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'El campo user_id es obligatorio.',
            'user_id.exists'   => 'El usuario no existe en la base de datos.',
            'title.required'   => 'El título es obligatorio.',
            'title.max'        => 'El título no puede superar los 255 caracteres.',
            'text.required'    => 'El texto es obligatorio.',
            'text.min'         => 'El texto debe tener al menos 10 caracteres.',
            'text.max'         => 'El texto no puede superar los 1000 caracteres.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Errores de validación',
            'errors' => $validator->errors(),
        ], 422));
    }
}
