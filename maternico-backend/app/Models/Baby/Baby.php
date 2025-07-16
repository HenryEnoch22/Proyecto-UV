<?php

namespace App\Models\Baby;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Baby extends Model
{
    public $timestamps = true;
    protected $table = 'babies';
    protected $fillable = [
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
