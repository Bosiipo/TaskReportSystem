<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public static $ADMIN = 1;
    public static $MANAGER = 2;
    public static $EMPLOYEE = 3;

    /**
     * Define a relationship with the User model.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}

