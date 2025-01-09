<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the specified user's information.
     */
    public function update(Request $request, $id)
    {
        // Determine which fields to validate based on the presence of specific input
        $validationRules = [
            'role_id' => 'nullable|integer|exists:roles,id', // Always validate role_id if present
        ];

        // If additional fields are provided, add validation for them
        if ($request->has(['date', 'department_id', 'hours_worked', 'task_details'])) {
            $validationRules = array_merge($validationRules, [
                'date' => 'required|date',
                'department_id' => 'required|string|max:255',
                'hours_worked' => 'required|numeric|min:0',
                'task_details' => 'required|string|min:255',
            ]);
        }

        // Validate the incoming request
        $validatedData = $request->validate($validationRules);

        // Find the user by ID
        $user = User::findOrFail($id);

        // Update the user's role_id if provided
        if (isset($validatedData['role_id'])) {
            $user->role_id = $validatedData['role_id'];
        }

        // Update additional fields if provided
        if (isset($validatedData['date'], $validatedData['department_id'], $validatedData['hours_worked'], $validatedData['task_details'])) {
            $user->date = $validatedData['date'];
            $user->department_id = $validatedData['department_id'];
            $user->hours_worked = $validatedData['hours_worked'];
            $user->task_details = $validatedData['task_details'];
        }

        // Example: Handle email change
        if ($user->isDirty('email')) {
            $user->email_verified_at = null; // Reset email verification
        }

        // Update user status
        $user->status = Status::SUBMITTED;

        // Save the updated user
        $user->save();

        // Return a response
        return Inertia::render('RoleDashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    // public function getUsersWithRoles()
    // {
    //     // Fetch users with their role (eager loading)
    //     $users = User::with('role')->get();

    //     // Loop through the users and add the role name to the result
    //     $usersWithRoles = $users->map(function ($user) {
    //         return [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'role_id' => $user->role_id,
    //             // 'role_name' => $user->role->name,  // Accessing the role's name
    //             'role_name' => $user->role ? $user->role->name : null,
    //         ];
    //     });

    //     return response()->json($usersWithRoles);
    // }
    public function getUsersWithRoles(Request $request)
    {
        // Fetch paginated users with their role (eager loading)
        $perPage = $request->get('per_page', 5); // Default to 10 items per page if not specified
        $page = $request->get('page', 1); // Default to 1 page if not specified
        $users = User::with('role')->paginate($perPage);

        // Transform the paginated data to include role names
        $usersWithRoles = collect($users->items())->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role_name' => $user->role ? $user->role->name : null,
            ];
        });

         // Replace the original data with the transformed data
        $paginatedData = $users->toArray();
        $paginatedData['data'] = $usersWithRoles;


        return response()->json($paginatedData);
    }
}
