<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Services\RoleService;
// use Illuminate\Container\Attributes\Log;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    protected ?RoleService $roleService = null;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the roles.
     *
     * @return View
     */
    public function index(): JsonResponse
    {
        $roles = Role::paginate(5);
        // return view('admin.roles.index', compact('roles'));
        // dd($roles);
        // Log::info("message");::info('Roles API accessed.');
        // dump($roles);
        return response()->json($roles);
    }

    /**
     * Show the form for creating a new role.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.roles.create');
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
     * Remove the specified role from storage.
     *
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully.');
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
