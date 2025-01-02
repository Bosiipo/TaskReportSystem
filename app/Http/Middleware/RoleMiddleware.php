<?php

namespace App\Http\Middleware;

use Closure;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;
// use Illuminate\Http\Request;
// use Closure;


class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // $user = Auth::user();

        // Check if the user is authenticated and has the required role
        // if ($user && ($user->role_id == 1)) {
            return $next($request); // Allow access
        // }

        // abort(403, 'Unauthorized');
    }
}
