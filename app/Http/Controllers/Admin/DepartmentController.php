<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Services\DepartmentService;
// use Illuminate\Container\Attributes\Log;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    protected ?DepartmentService $departmentService = null;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    /**
     * Display a listing of the departments.
     *
     * @return View
     */
    public function index(): JsonResponse
    {
        $department = Department::all();
        return response()->json($department);
    }

    /**
     * Store a newly created role in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // Add other validation rules as necessary
        ]);

        Role::create($validatedData);

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param Role $role
     * @return View
     */
    public function edit(Role $role): View
    {
        return view('admin.roles.edit', compact('role'));
    }

    /**
     * Update the specified role in storage.
     *
     * @param Request $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // Add other validation rules as necessary
        ]);

        $role->update($validatedData);

        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Display a specific role.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $role = Role::where('id', $id)->first();

        // if (!$role) {
        //     return response()->json(['message' => 'Role not found'], 404);
        // }

        return response()->json($role);
    }
}
