<?php

use App\Http\Controllers\Admin\AccessRequestController as AdminAccessRequestController;
use App\Http\Controllers\Admin\PostApprovalController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Editor\PostController as EditorPostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\AccessRequestController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\JournalController;
use App\Http\Controllers\Public\SubscriberController;
use App\Models\AccessRequest;
use App\Models\Post;
use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', HomeController::class)->name('home');
Route::post('/access-requests', [AccessRequestController::class, 'store'])->name('access-requests.store');
Route::post('/subscribers', [SubscriberController::class, 'store'])->name('subscribers.store');
Route::get('/journal', [JournalController::class, 'index'])->name('journal.index');
Route::get('/journal/{post}', [JournalController::class, 'show'])->name('journal.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'approvedPosts' => Post::where('status', 'approved')->count(),
            'pendingPosts' => Post::where('status', 'pending')->count(),
            'accessRequests' => AccessRequest::where('status', 'pending')->count(),
            'subscribers' => Subscriber::count(),
            'users' => User::count(),
        ],
    ]);
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'editor'])->prefix('editor')->name('editor.')->group(function () {
    Route::resource('posts', EditorPostController::class)->except(['show', 'destroy']);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('posts', [PostApprovalController::class, 'index'])->name('posts.index');
    Route::patch('posts/{post}', [PostApprovalController::class, 'update'])->name('posts.update');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('access-requests', [AdminAccessRequestController::class, 'index'])->name('access-requests.index');
    Route::patch('access-requests/{accessRequest}', [AdminAccessRequestController::class, 'update'])->name('access-requests.update');
});

require __DIR__.'/auth.php';
