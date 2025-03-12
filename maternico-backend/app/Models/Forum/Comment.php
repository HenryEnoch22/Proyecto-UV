<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Comment extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'comments';
    protected $fillable = [
        'user_id',
        'forum_id',
        'text',
        'created_at',
        'deleted_at',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
