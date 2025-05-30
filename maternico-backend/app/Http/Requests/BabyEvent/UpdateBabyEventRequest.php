<?php

namespace App\Http\Requests\BabyEvent;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateBabyEventRequest extends FormRequest
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
            'baby_id' => ['sometimes', 'integer', 'exists:babies,id'],
            'event_title' => ['sometimes', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:255'],
            'event_date' => ['sometimes', 'date'],
            //'photo_path' => ['nullable', 'string', 'max:2048'],
        ];
    }

    public function messages()
    {
        return [
            'baby_id.integer' => 'El campo baby_id debe ser un número entero',
            'baby_id.exists' => 'El bebé no existe en la base de datos',
            'event_title.string' => 'El campo event_title debe ser una cadena de texto',
            'event_title.max' => 'El campo event_title debe tener un máximo de 64 caracteres',
            'description.string' => 'El campo description debe ser una cadena de texto',
            'description.max' => 'El campo description debe tener un máximo de 255 caracteres',
            'event_date.date' => 'El campo event_date debe ser una fecha',
            //TODO: Agregar mensajes de error para el campo photo_path
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
