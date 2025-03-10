<?php

namespace App\Models\Forum;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Forum extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'forums';
    protected $fillable = [
        'user_id',
        'title',
        'text',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
