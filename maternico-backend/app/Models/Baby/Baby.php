<?php

namespace App\Models\Baby;

use Illuminate\Database\Eloquent\Model;

class Baby extends Model
{
    public $timestamps = true;
    protected $table = 'babies';
    protected $fillable = [
        'name',
        'last_name',
        'mother_last_name',
        'weight',
        'height',
        'birth_date',
        'blood_type',
        'created_at',
        'updated_at',
    ];
}
