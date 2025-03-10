<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'videos';
    protected $fillable = [
        'title',
        'video_path',
    ];
}
