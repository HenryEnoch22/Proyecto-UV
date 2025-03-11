<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'comments';
    protected $fillable = [
        'forum_id',
        'text',
        'created_at',
        'deleted_at',
    ];
}
