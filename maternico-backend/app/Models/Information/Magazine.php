<?php

namespace App\Models\Information;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Magazine extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'magazines';
    public $fillable = [
        'title',
        'magazine_path',
        'category',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
