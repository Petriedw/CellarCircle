<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use Illuminate\Http\Request;

class AccessRequestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:access_requests,email'],
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        AccessRequest::create($data);

        return back()->with('status', 'Access request received. The editor desk will review it soon.');
    }
}
