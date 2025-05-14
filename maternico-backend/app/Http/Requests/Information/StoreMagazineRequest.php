<?php

namespace App\Http\Requests\Information;

use Illuminate\Foundation\Http\FormRequest;

class StoreMagazineRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'magazine_path' => 'required|string',
            'category' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.string' => 'El título debe ser una cadena de texto.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'magazine_path.required' => 'La ruta del archivo es obligatoria.',
            'magazine_path.string' => 'La ruta del archivo debe ser una cadena de texto.',
            'category.string' => 'La categoría debe ser una cadena de texto.',
            'category.max' => 'La categoría no puede tener más de 255 caracteres.',
            'category.required' => 'La categoría es obligatoria.',
        ];
    }
}
