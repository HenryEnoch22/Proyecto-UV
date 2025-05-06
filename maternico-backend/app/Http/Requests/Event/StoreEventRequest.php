<?php

namespace App\Http\Requests\Event;

use App\Models\Event\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreEventRequest extends FormRequest
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
            'user_id' => ['required', 'exists:users,id'], // Debe existir en la tabla users
            'event_title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:' . implode(',', Event::$types)],
            'date' => ['required', 'date'],
            'time' => ['sometimes', 'string', 'date_format:H:i', 'max:6'],
            'notifiable' => ['required', 'boolean'],
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'El campo user_id es obligatorio.',
            'user_id.exists' => 'El usuario no existe.',
            'event_title.required' => 'El título del evento es obligatorio.',
            'event_title.string' => 'El título del evento debe ser una cadena de texto.',
            'event_title.max' => 'El título del evento no puede superar los 255 caracteres.',
            'type.required' => 'El tipo de evento es obligatorio.',
            'type.string' => 'El tipo de evento debe ser una cadena de texto.',
            'type.in' => 'El tipo de evento no es válido. Debe ser uno de los siguientes: ' . implode(', ', Event::$types) . '.',
            'date.required' => 'La fecha del evento es obligatoria.',
            'date.date' => 'El formato de la fecha es inválido. Usa el formato YYYY-MM-DD.',
            'time.date_format' => 'El campo hora debe de ser una hora válida. Ejemplo: 12:00 - 09:30',
            'time.string' => 'El campo hora debe ser una cadena de texto.',
            'time.max' => 'El campo hora no puede superar los 6 caracteres.',
            'notifiable.required' => 'El campo notifiable es obligatorio.',
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
