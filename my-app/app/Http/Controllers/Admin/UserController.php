<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in($request->user()->isHeadAdmin() ? ['head_admin', 'admin', 'editor'] : ['admin', 'editor'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return back()->with('status', 'User added.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => ['required', Rule::in($request->user()->isHeadAdmin() ? ['head_admin', 'admin', 'editor'] : ['admin', 'editor'])],
        ]);

        abort_if($user->isHeadAdmin() && $data['role'] !== 'head_admin', 403, 'Head admins cannot be demoted.');
        abort_if($request->user()->is($user) && ! in_array($data['role'], ['head_admin', 'admin'], true), 422, 'You cannot remove your own admin access.');

        $user->update($data);

        return back()->with('status', 'User role updated.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_if($request->user()->is($user), 422, 'You cannot delete your own account.');
        abort_if($user->isHeadAdmin(), 403, 'Head admins cannot be deleted.');

        $user->delete();

        return back()->with('status', 'User removed.');
    }
}
