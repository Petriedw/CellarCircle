<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccessRequestController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/AccessRequests/Index', [
            'requests' => AccessRequest::latest()->get(),
        ]);
    }

    public function update(Request $request, AccessRequest $accessRequest)
    {
        if ($request->input('status') === 'rejected') {
            $accessRequest->update([
                'status' => 'rejected',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            return back()->with('status', 'Access request rejected.');
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['approved'])],
            'role' => ['required', Rule::in(['admin', 'editor'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($data['status'] === 'approved' && ! User::where('email', $accessRequest->email)->exists()) {
            User::create([
                'name' => $accessRequest->name,
                'email' => $accessRequest->email,
                'role' => $data['role'] ?? 'editor',
                'password' => Hash::make($data['password']),
            ]);
        }

        $accessRequest->update([
            'status' => $data['status'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('status', 'Access request reviewed.');
    }
}
