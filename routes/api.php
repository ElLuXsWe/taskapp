<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// Rutas para el CRUD de tareas
Route::get('/tasks', [TaskController::class, 'index']);    // Listar todas las tareas
Route::post('/tasks', [TaskController::class, 'store']);   // Crear nueva tarea
Route::put('/tasks/{task}', [TaskController::class, 'update']);  // Actualizar tarea existente
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);  // Eliminar tarea
