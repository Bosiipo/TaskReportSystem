<?php

namespace App\Http\Middleware;

use Closure;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Arr;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// use Illuminate\Http\Request;
// use Closure;


class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next, ...$roles): Response
    // {
    //     // $user = Auth::user();

    //     // Check if the user is authenticated and has the required role
    //     // if ($user && ($user->role_id == 1)) {
    //         return $next($request); // Allow access
    //     // }

        // abort(403, 'Unauthorized');
    // }
    public function handle(Request $request, Closure $next, ...$role)
    {
        $destructured_role = Arr::first($role);

        Log::info('Role Middleware Check', [
            'first item' => $destructured_role,
            'auth user role' =>  auth()->user()->role->name,
            'roleMatch' => $destructured_role === auth()->user()->role->name
        ]);

        if (auth()->check() && auth()->user()->role->name === $destructured_role) {
            return $next($request);
        }

        abort(403, 'Unauthorized');
    }
}
