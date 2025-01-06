<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => Auth::user(),
        ]]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/assign-roles', function () {
        return Inertia::render('RoleDashboard', [
            'auth' => [
                'user' => Auth::user(),
            ]]);
    });
});

Route::get('/task-form', function () {
    return Inertia::render('TaskForm',[
        'auth' => [
            'user' => Auth::user(),
        ]]);
})->middleware(['auth'])->name('task-form');

Route::get('/task-reports', function () {
    return Inertia::render('ManagerApprovalDashboard',[
        'auth' => [
            'user' => Auth::user(),
        ]]);
})->middleware(['auth'])->name('task-reports');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
