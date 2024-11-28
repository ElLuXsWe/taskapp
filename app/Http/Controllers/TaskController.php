<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Método para obtener todas las tareas
    public function index()
    {
        return response()->json(Task::all());  
    }

    // Método para crear una nueva tarea
    public function store(Request $request)
    {
        $task = Task::create($request->all());
        return response()->json($task, 201);
    }

    // Método para actualizar una tarea
    public function update(Request $request, Task $task)
    {
        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy($id)
    {
        
        $task = Task::find($id);
    
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
    
        $task->delete();
    
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
    public function completeTask($id)
    {
        $task = Task::findOrFail($id);  // Encuentra la tarea por su ID

        $task->completed = true;  // Marca la tarea como completada
        $task->save();  // Guarda los cambios

        return response()->json($task);  // Devuelve la tarea actualizada
    }
}

