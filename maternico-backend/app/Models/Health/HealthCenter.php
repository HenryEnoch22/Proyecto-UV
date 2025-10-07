<?php

namespace App\Models\Health;

use Illuminate\Database\Eloquent\Model;

class HealthCenter extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'phone_number',
        'type',
        'latitude',
        'longitude',
    ];
}
