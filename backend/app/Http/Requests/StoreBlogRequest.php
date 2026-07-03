<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category_id' => 'nullable|exists:categories,id',
            'image_url' => 'nullable|string|max:500',
            'tags' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Tiêu đề là bắt buộc',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            'content.required' => 'Nội dung là bắt buộc',
            'content.min' => 'Nội dung phải có ít nhất 10 ký tự',
            'category_id.exists' => 'Danh mục không tồn tại',
            'image_url.max' => 'URL ảnh không được vượt quá 500 ký tự',
        ];
    }
}
