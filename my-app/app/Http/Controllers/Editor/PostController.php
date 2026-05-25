<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('author:id,name')->latest();

        if (! $request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        return Inertia::render('Editor/Posts/Index', [
            'posts' => $query->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Editor/Posts/Create');
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;
        $data['slug'] = $this->uniqueSlug($data['title']);
        $data['status'] = 'pending';

        if ($request->hasFile('hero_image')) {
            $data['hero_image_path'] = $request->file('hero_image')->store('posts', 'public');
        }

        Post::create($data);

        return redirect()->route('editor.posts.index')->with('status', 'Blog submitted for admin approval.');
    }

    public function edit(Request $request, Post $post)
    {
        $this->authorizePost($request, $post);

        return Inertia::render('Editor/Posts/Edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorizePost($request, $post);

        $data = $this->validated($request);
        $data['status'] = 'pending';
        $data['approved_by'] = null;
        $data['approved_at'] = null;

        if ($request->hasFile('hero_image')) {
            $data['hero_image_path'] = $request->file('hero_image')->store('posts', 'public');
        }

        $post->update($data);

        return redirect()->route('editor.posts.index')->with('status', 'Blog updated and returned to pending approval.');
    }

    public function storeImage(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = $data['image']->store('posts/inline', 'public');

        return response()->json([
            'url' => "/storage/{$path}",
        ]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:120'],
            'excerpt' => ['required', 'string', 'max:500'],
            'body' => ['required', 'string', 'min:300'],
            'guideline_notes' => ['nullable', 'string', 'max:2000'],
            'hero_image' => ['nullable', 'image', 'max:4096'],
        ]);
    }

    private function authorizePost(Request $request, Post $post): void
    {
        abort_unless($request->user()->isAdmin() || $post->user_id === $request->user()->id, 403);
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $count = 2;

        while (Post::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }
}
