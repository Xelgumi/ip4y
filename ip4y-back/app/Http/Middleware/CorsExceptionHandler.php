<?php

namespace App\Http\Middleware;

use Closure;

class CorsExceptionHandler
{
    public function handle($request, Closure $next)
    {
        try {
            // Executa a solicitação normalmente
            $response = $next($request);
        } catch (\Exception $e) {
            // Se ocorrer uma exceção, ajusta os cabeçalhos CORS
            $response = $this->handleException($request, $e);
        }

        return $response;
    }

    protected function handleException($request, \Exception $e)
    {
        $headers = [
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
            'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Accept, Authorization, Origin',
        ];

        // Ajusta os cabeçalhos CORS
        return response()->json(['error' => $e->getMessage()], 500, $headers);
    }
}
