<?php

namespace App\Http\Requests\Forum;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreCommentRequest extends FormRequest
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
            'forum_id' => ['required', 'exists:forums,id'],
            'text'     => ['required', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'forum_id.required' => 'El campo forum_id es obligatorio.',
            'forum_id.exists'   => 'El foro no existe en la base de datos.',
            'text.required'     => 'El texto del comentario es obligatorio.',
            'text.string'       => 'El comentario debe ser una cadena de texto.',
            'text.max'          => 'El comentario no puede superar los 255 caracteres.',
        ];
    }

    /**
     * Handle failed validation
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Errores de validación',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
