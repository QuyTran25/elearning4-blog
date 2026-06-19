<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'blog_id',
        'author_name',
        'content',
        'displayed_text',
        'mlp_label',
        'mlp_confidence',
        'bad_words',
        'action',
        'status',
    ];

    protected $casts = [
        'bad_words' => 'array',
        'mlp_confidence' => 'float',
    ];

    // Quan hệ với Blog
    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
}
