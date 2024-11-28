<?php

return [
    'paths' => [
        'api/*',        // Permitir todas las rutas que estén bajo el prefijo 'api/'
        'tasks',        // Permitir las rutas relacionadas con 'tasks' (como listar, agregar, editar, eliminar)
        'tasks/*',      // Asegurarse de que también se cubran las rutas con ID, como editar y eliminar
    ],
    'allowed_methods' => ['*'], // Permitir todos los métodos HTTP (GET, POST, PUT, DELETE)
    'allowed_origins' => ['http://localhost:3000'], // Permitir solicitudes desde localhost:3000
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Permitir todos los encabezados
    'exposed_headers' => [],
    'max_age' => 0,
   'supports_credentials' => true,  // Esto permite credenciales como cookies
];

