<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('POST') ? 'required' : 'sometimes|required';

        return [
            'name' => "{$required}|string|max:255",
            'price' => "{$required}|numeric|min:0",
            'description' => 'sometimes|nullable|string',
        ];
    }
}
