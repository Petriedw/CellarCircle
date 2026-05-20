<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        return Inertia::render('Journal/Index', [
            'posts' => Post::with('author:id,name')
                ->where('status', 'approved')
                ->latest('approved_at')
                ->paginate(9)
                ->through(fn (Post $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'category' => $post->category,
                    'excerpt' => $post->excerpt,
                    'hero_image_url' => $post->hero_image_url,
                    'approved_at' => $post->approved_at?->toFormattedDateString(),
                    'author' => $post->author?->only('name'),
                ]),
        ]);
    }

    public function show(Post $post)
    {
        abort_unless($post->status === 'approved', 404);

        return Inertia::render('Journal/Show', [
            'post' => [
                'title' => $post->title,
                'category' => $post->category,
                'excerpt' => $post->excerpt,
                'body' => $post->body,
                'hero_image_url' => $post->hero_image_url,
                'approved_at' => $post->approved_at?->toFormattedDateString(),
                'author' => $post->author?->only('name'),
            ],
        ]);
    }
}
