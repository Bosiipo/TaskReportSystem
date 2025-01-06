<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Filesystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('files', function () {
            return new Filesystem();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // Inertia::share('auth', function () {
        //     return [
        //         'user' => Auth::user(),
        //     ];
        // });
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::check() ? Auth::user() : null,
                ];
            },
        ]);
    }
}
