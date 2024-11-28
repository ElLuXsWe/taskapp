<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Esto habilita los timestamps
    public $timestamps = true;

    // Asegúrate de definir qué campos se pueden llenar (opcional)
    protected $fillable = ['title', 'description', 'completed'];
}
