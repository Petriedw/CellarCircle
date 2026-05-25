<?php

namespace App\Http\Controllers;

use App\Models\AccessRequest;
use App\Models\Post;
use App\Models\Subscriber;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'approvedPosts' => Post::where('status', 'approved')->count(),
                'pendingPosts' => Post::where('status', 'pending')->count(),
                'accessRequests' => AccessRequest::where('status', 'pending')->count(),
                'subscribers' => Subscriber::count(),
                'users' => User::count(),
            ],
        ]);
    }
}
