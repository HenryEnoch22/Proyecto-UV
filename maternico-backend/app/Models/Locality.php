<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locality extends Model
{
    protected $table = 'localities';
    protected $fillable = ['state_name', 'municipality_name', 'locality_name', 'area_type', 'latitude', 'longitude', 
        'latitude_decimal', 'longitude_decimal', 'elevation'];
}
