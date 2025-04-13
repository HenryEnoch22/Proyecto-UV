<?php

namespace App\Models\Event;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use softDeletes;
    public $timestamps = true;
    protected $table = 'events';
    protected $fillable = [
       'user_id',
        'event_title',
        'type',
        'date',
        'time',
        'notifiable',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public static $types = [
        1 => 'Vacunación',
        2 => 'Alimentación',
        3 => 'Desarrollo',
        4 => 'Cita médica',
        5 => 'Cumpleaños'
    ];
}
