<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function getUsers()
    {
        return User::with('role')->get(); // Eager load roles
    }

    public function getRoles()
    {
        return Role::all();
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->update([
            'role_id' => $request->role_id,
        ]);

        return response()->noContent();
    }

    public function roleAssignmentPage(Request $request, User $user)
    {
        return Inertia::render('RoleDashboard');
        // return redirect()->intended(route('dashboard', absolute: false));

        // [
        //     // 'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        //     'status' => session('status'),
        // ]);
    }
}
