<?php
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
Route::get('/', function() {
    return 'Ruta de prueba';
});
Route::get('/tasks', [TaskController::class, 'index']);    // Listar todas las tareas
Route::post('/tasks', [TaskController::class, 'store']);   // Crear nueva tarea
Route::put('/tasks/{task}', [TaskController::class, 'update']);  // Actualizar tarea existente
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);  // Eliminar tarea
Route::put('/tasks/{id}/complete', [TaskController::class, 'completeTask']);// Completar la tarea
