<?php

namespace App\Http\Requests\BabyEvent;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreBabyEventRequest extends FormRequest
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
            'baby_id' => ['required', 'integer', 'exists:babies,id'],
            'event_title' => ['required', 'string', 'max:64'],
            'description' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
           'photo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages()
    {
        return [
            'baby_id.required' => 'El campo baby_id es obligatorio',
            'baby_id.integer' => 'El campo baby_id debe ser un número entero',
            'baby_id.exists' => 'El bebé no existe en la base de datos',
            'event_title.required' => 'El campo event_title es obligatorio',
            'event_title.string' => 'El campo event_title debe ser una cadena de texto',
            'event_title.max' => 'El campo event_title debe tener un máximo de 45 caracteres',
            'description.required' => 'El campo description es obligatorio',
            'description.string' => 'El campo description debe ser una cadena de texto',
            'description.max' => 'El campo description debe tener un máximo de 255 caracteres',
            'event_date.required' => 'El campo event_date es obligatorio',
            'event_date.date' => 'El campo event_date debe ser una fecha',
            //TODO: Agregar mensajes de error para el campo photo_path
            'photo_path.image' => 'El archivo debe ser una imagen',
            'photo_path.mimes' => 'La imagen debe ser de tipo jpeg, png o jpg',
            'photo_path.max' => 'La imagen no debe superar los 2MB',
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
