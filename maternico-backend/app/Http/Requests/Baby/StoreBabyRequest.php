<?php

namespace App\Http\Requests\Baby;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreBabyRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'name' => ['required', 'string', 'max:64'],
            'last_name' => ['required', 'string', 'max:64'],
            'mother_last_name' => ['required', 'string', 'max:64'],
            'weight' => ['required', 'string', 'max:45'],
            'height' => ['required', 'string', 'max:45'],
            'birth_date' => ['required', 'date'],
            'blood_type' => ['required', 'string', 'max:45'],
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'El campo user_id es obligatorio',
            'user_id.string' => 'El campo user_id debe ser una cadena de texto',
            'user_id.exists' => 'El usuario no existe en la base de datos',
            'name.required' => 'El campo name es obligatorio',
            'name.string' => 'El campo name debe ser una cadena de texto',
            'name.max' => 'El campo name debe tener un máximo de 64 caracteres',
            'last_name.required' => 'El campo last_name es obligatorio',
            'last_name.string' => 'El campo last_name debe ser una cadena de texto',
            'last_name.max' => 'El campo last_name debe tener un máximo de 64 caracteres',
            'mother_last_name.required' => 'El campo mother_last_name es obligatorio',
            'mother_last_name.string' => 'El campo mother_last_name debe ser una cadena de texto',
            'mother_last_name.max' => 'El campo mother_last_name debe tener un máximo de 64 caracteres',
            'weight.required' => 'El campo weight es obligatorio',
            'weight.string' => 'El campo weight debe ser una cadena de texto',
            'weight.max' => 'El campo weight debe tener un máximo de 45 caracteres',
            'height.required' => 'El campo height es obligatorio',
            'height.string' => 'El campo height debe ser una cadena de texto',
            'height.max' => 'El campo height debe tener un máximo de 45 caracteres',
            'birth_date.required' => 'El campo birth_date es obligatorio',
            'birth_date.date' => 'El campo birth_date debe ser una fecha',
            'blood_type.required' => 'El campo blood_type es obligatorio',
            'blood_type.string' => 'El campo blood_type debe ser una cadena de texto',
            'blood_type.max' => 'El campo blood_type debe tener un máximo de 45 caracteres',
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
