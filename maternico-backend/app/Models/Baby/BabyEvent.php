<?php

namespace App\Models\Baby;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BabyEvent extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'baby_events';
    protected $fillable = [
        'baby_id',
        'event_title',
        'description',
        'date',
        'photo_path',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
