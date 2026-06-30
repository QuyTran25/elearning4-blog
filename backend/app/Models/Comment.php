<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'blog_id',
        'parent_id',
        'author_id',
        'author_name',
        'content',
        'displayed_text',
        'mlp_label',
        'mlp_confidence',
        'bad_words',
        'action',
        'status',
        'is_admin_reply',
    ];

    protected $casts = [
        'bad_words' => 'array',
        'mlp_confidence' => 'float',
        'is_admin_reply' => 'boolean',
    ];

    // Quan hệ với Blog
    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    // Replies (con)
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    // Parent comment (cha)
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // Scope: chỉ lấy root comments (không có parent)
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
