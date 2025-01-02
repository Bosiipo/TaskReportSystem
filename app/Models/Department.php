<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Define a relationship with the User model.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}

