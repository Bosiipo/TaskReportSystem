<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\TaskReport;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
// use App\Enums\Status;
// use App\Enums\Status;

class TaskReportController extends Controller
{
    /**
     * Display a listing of the roles.
     *
     * @return View
     */
    public function index(): JsonResponse
    {
        $taskReports = TaskReport::all();
        return response()->json($taskReports);
    }

    /**
     * Display a listing of tasks submitted for the day with filtering and pagination.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function tasksSubmittedToday(Request $request): JsonResponse
    {
        // Retrieve query parameters for filtering
        $department = $request->query('department');
        $employeeName = $request->query('employee_name');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $perPage = $request->query('per_page', 10); // Default items per page is 10

        // Build the query
        $query = TaskReport::query();

        // Apply filters if provided
        if ($department) {
            $query->where('department', $department);
        }

        if ($employeeName) {
            $query->where('employee_name', 'LIKE', '%' . $employeeName . '%');
        }

        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        } elseif ($startDate) {
            $query->where('date', '>=', $startDate);
        } elseif ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        // Paginate the results
        $taskReports = $query->paginate($perPage);

        // Return a JSON response
        return response()->json($taskReports);
    }


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

    // /**
    //  * Update the specified user's information.
    //  */
    // public function update(Request $request, $id)
    // {
    //     // Determine which fields to validate based on the presence of specific input
    //     $validationRules = [
    //         'role_id' => 'nullable|integer|exists:roles,id', // Always validate role_id if present
    //     ];

    //     // If additional fields are provided, add validation for them
    //     if ($request->has(['date', 'department_id', 'hours_worked', 'task_details'])) {
    //         $validationRules = array_merge($validationRules, [
    //             'date' => 'required|date',
    //             'department_id' => 'required|string|max:255',
    //             'hours_worked' => 'required|numeric|min:0',
    //             'task_details' => 'required|string|min:255',
    //         ]);
    //     }

    //     // Validate the incoming request
    //     $validatedData = $request->validate($validationRules);

    //     // Find the user by ID
    //     $user = User::findOrFail($id);

    //     // Update the user's role_id if provided
    //     if (isset($validatedData['role_id'])) {
    //         $user->role_id = $validatedData['role_id'];
    //     }

    //     // Update additional fields if provided
    //     if (isset($validatedData['date'], $validatedData['department_id'], $validatedData['hours_worked'], $validatedData['task_details'])) {
    //         $user->date = $validatedData['date'];
    //         $user->department_id = $validatedData['department_id'];
    //         $user->hours_worked = $validatedData['hours_worked'];
    //         $user->task_details = $validatedData['task_details'];
    //     }

    //     // Example: Handle email change
        // if ($user->isDirty('email')) {
        //     $user->email_verified_at = null; // Reset email verification
        // }

    //     // Update user status
    //     $user->status = Status::SUBMITTED;

    //     // Save the updated user
    //     $user->save();

    //     // Return a response
    //     return Inertia::render('RoleDashboard', [
    //         'auth' => [
    //             'user' => Auth::user(),
    //         ],
    //     ]);
    // }

        /**
     * Update the specified user's information.
     */
    public function update(Request $request, $id)
    {
        $taskReport = TaskReport::where('id', $id);
        // Define validation rules
        $validationRules = [
            'date' => 'sometimes|date', // Task date, optional but validated if present
            'department_id' => 'sometimes|integer|exists:departments,id', // Department ID, optional
            'hours_worked' => 'sometimes|numeric|min:0', // Hours worked, optional
            'task_details' => 'sometimes|string|min:10|max:1000', // Task details, optional
        ];
    
        // Validate request data
        $validatedData = $request->validate($validationRules);
    
        try {

            if ($taskReport->isDirty('date')) {
                $taskReport->date = $validatedData['date']; 
            }

            if ($taskReport->isDirty('department_id')) {
                $taskReport->department_id = $validatedData['department_id']; 
            }

            if ($taskReport->isDirty('hours_worked')) {
                $taskReport->date = $validatedData['hours_worked']; 
            }

            if ($taskReport->isDirty('task_details')) {
                $taskReport->task_details = $validatedData['task_details']; 
            }

            $taskReport->save();

    
            // Return success response
            return response()->json(['message' => 'Task report updated successfully.'], 200);
        } catch (\Exception $e) {
            // Handle exceptions
            return response()->json(['error' => 'Failed to update task report.', 'details' => $e->getMessage()], 500);
        }
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

        // $user = Auth::user();
        $user = Auth::user();
        $role = Role::find($user->role_id);
        // Validate the incoming request data
        $validatedData = $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'department_id' => 'required|numeric|exists:departments,id', // Ensure department exists
            'hours_worked' => 'required|numeric|min:0|max:24', // Limit hours worked to a reasonable range
            'task_details' => 'required|string|min:10|max:1000', // Adjust min/max length for task details
            // 'role_id' => 'required|exists:roles,id', // Ensure role exists
            // 'status' => 'required|string|in:Pending,In Progress,Completed', // Define allowed status values
        ]);

        // Add the authenticated user's ID to the validated data
        $validatedData['user_id'] = $user->id;
        $validatedData['employee_name'] = $user->name;
        $validatedData['role'] = $role->role_name;
        $validatedData['email'] = $user->email;
        $validatedData['status'] = 'submitted';
        $validatedData['role_id'] = $user->role_id;

        try {
            // Create the task report
            Log::info('Creating TaskReport');
            $taskReport = TaskReport::create($validatedData);
            Log::info('TaskReport Created:', $taskReport->toArray());
            // Redirect with a success message
            return redirect('/task-form')->back()->with('success', 'Task report created successfully.');
        } catch (\Exception $e) {
            Log::error('Error Creating TaskReport:', ['message' => $e->getMessage()]);
            // Handle any errors during the creation process
            return redirect('/task-form')->back()->with('error', 'An error occurred while creating the task report: ' . $e->getMessage());
        }
    }

    public function getTaskReportsWithReferences()
    {
        // Fetch users with their role (eager loading)
        $taskReports = TaskReport::with(['department', 'role', 'user'])->get();

        // Loop through the users and add the role name to the result
        $taskReportsExtra = $taskReports->map(function ($taskReport) {
            Log::info('Department', [
                'taskReportId' => $taskReport->id,
                'department' => $taskReport->department,
            ]);
            return [
                'id' => $taskReport->id,
                'date' => $taskReport->date,
                'status' => $taskReport->status,
                'employee_name' => $taskReport->employee_name,
                'task_details' => $taskReport->task_details,
                'hours_worked' => $taskReport->hours_worked,
                // 'employee_name' => $taskReport->user->name,
                'email' => $taskReport->email,
                'role_id' => $taskReport->role_id,
                // 'role' => $taskReport->role ? $taskReport->role->name : null,
                // 'user' => $taskReport->user ? $taskReport->user->name : null,
                'department' => $taskReport->department ? $taskReport->department->name : null,
                'manager_comments' => $taskReport->manager_comments,
                // 'manager_name' => $taskReport->manager ? $taskReport->manager->name : null,
            ];
        });

        

        return response()->json($taskReportsExtra);
    }
}
