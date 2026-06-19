<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModerationLog extends Model
{
    use HasFactory;

    protected $table = 'moderation_logs';
    public $timestamps = false;

    protected $fillable = [
        'comment_id',
        'username',
        'log_action',
        'details',
        'logged_at',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
    ];

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
