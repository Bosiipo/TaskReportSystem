<?php

use App\Http\Controllers\Admin\RoleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DepartmentController;
// use App\Models\Role;

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskReportController;

Route::post('/register', [RegisteredUserController::class, 'store']);

// Route::middleware(['auth', 'verified'])->group(function () {

Route::get('/roles/{id}', [RoleController::class, 'show']);

Route::get('/roles', [RoleController::class, 'index']);

Route::get('/users-with-roles', [ProfileController::class, 'getUsersWithRoles']);
// ->middleware('role');

Route::put('/user/{id}', [ProfileController::class, 'update']);

Route::get('/department', [DepartmentController::class, 'index']);

Route::post('/task-submission', [TaskReportController::class, 'store']);

Route::get('/task-reports', [TaskReportController::class, 'getTaskReportsWithReferences']);

Route::put('/task-report/{id}', [TaskReportController::class, 'update']);

Route::get('/dashboard-reports', [TaskReportController::class, 'tasksSubmittedToday']);



// Route::middleware('auth:sanctum')->get('/roles', [RoleController::class, 'index']);



// Route::post('/roles', [RoleController::class, 'index']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/users', [AdminController::class, 'getUsers']);
    // Route::get('/roles', [AdminController::class, 'getRoles']);
    Route::put('/users/{user}/update-role', [AdminController::class, 'updateUserRole']);
});

