<?php

namespace App\Http\Requests\Event;

use App\Models\Event\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateEventRequest extends FormRequest
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
            'event_title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:' . implode(',', Event::$types)],
            'date' => ['sometimes', 'date'],
            'time' => ['sometimes', 'string', 'date_format:H:i', 'max:6'],
            'notifiable' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'event_title.string' => 'El título del evento debe ser una cadena de texto.',
            'event_title.max' => 'El título del evento no puede superar los 255 caracteres.',
            'type.string' => 'El tipo de evento debe ser una cadena de texto.',
            'type.in' => 'El tipo de evento no es válido. Debe ser uno de los siguientes: ' . implode(', ', Event::$types) . '.',
            'date.date' => 'El formato de la fecha es inválido. Usa el formato YYYY-MM-DD.',
            'time.date_format' => 'El campo hora debe ser una hora válida. Ejemplo: 12:00 - 09:30',
            'time.string' => 'El campo hora debe ser una cadena de texto.',
            'time.max' => 'El campo hora no puede superar los 6 caracteres.',
            'notifiable.boolean' => 'El campo notifiable debe ser verdadero o falso.',
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
