<?php

namespace App\Http\Requests\Forum;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateForumRequest extends FormRequest
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
            'user_id' => ['sometimes', 'exists:users,id'],
            'title'   => ['sometimes', 'string', 'max:255'],
            'text'    => ['sometimes', 'string', 'min:10', 'max:1000']
        ];
    }

    public function messages()
    {
        return [
            'user_id.exists'   => 'El usuario no existe en la base de datos.',
            'title.string'     => 'El título debe ser una cadena de texto.',
            'title.max'        => 'El título no puede superar los 255 caracteres.',
            'text.string'      => 'El texto debe ser una cadena de texto.',
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
