<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'posts' => Post::with('author:id,name')
                ->where('status', 'approved')
                ->latest('approved_at')
                ->take(6)
                ->get(['id', 'user_id', 'title', 'slug', 'category', 'excerpt', 'hero_image_path', 'approved_at']),
        ]);
    }
}
