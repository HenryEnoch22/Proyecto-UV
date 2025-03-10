<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    public $timestamps = true;
    protected $table = 'comments';
    protected $fillable = [
        'forum_id',
        'text',
        'created_at',
        'deleted_at',
    ];
}
