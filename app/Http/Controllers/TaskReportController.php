<?php

namespace App\Http\Controllers;

use App\Models\TaskReport;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use App\Enums\Status;
// use App\Enums\Status;

class TaskReportController extends Controller
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

    /**
     * Store a newly created role in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {

        $user = Auth::user();
        // Validate the incoming request data
        $validatedData = $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'department_id' => 'required|exists:departments,id', // Ensure department exists
            'hours_worked' => 'required|numeric|min:0|max:24', // Limit hours worked to a reasonable range
            'task_details' => 'required|string|min:10|max:1000', // Adjust min/max length for task details
            // 'role_id' => 'required|exists:roles,id', // Ensure role exists
            // 'status' => 'required|string|in:Pending,In Progress,Completed', // Define allowed status values
        ]);

        // Add the authenticated user's ID to the validated data
        $validatedData['user_id'] = $user->id;
        $validatedData['employee_name'] = $user->name;
        // $validatedData['employee_name'] = $user->employee_name;
        $validatedData['email'] = $user->email;
        $validatedData['status'] = 'submitted';
        $validatedData['role_id'] = $user->role_id;

        try {
            // Create the task report
            TaskReport::create($validatedData);
    
            // Redirect with a success message
            return redirect()->back()->with('success', 'Task report created successfully.');
        } catch (\Exception $e) {
            // Handle any errors during the creation process
            return redirect()->back()->with('error', 'An error occurred while creating the task report: ' . $e->getMessage());
        }
    }
    
}
