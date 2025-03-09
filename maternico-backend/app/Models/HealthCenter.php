<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthCenter extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'phone_number',
    ];
}
