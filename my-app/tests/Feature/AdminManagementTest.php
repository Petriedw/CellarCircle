<?php

namespace Tests\Feature;

use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reject_access_request_even_when_password_field_was_filled(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $accessRequest = AccessRequest::create([
            'name' => 'Rejected Writer',
            'email' => 'rejected@example.com',
            'reason' => 'I would like to contribute.',
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.access-requests.update', $accessRequest), [
            'status' => 'rejected',
            'password' => 'password123',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas(AccessRequest::class, [
            'id' => $accessRequest->id,
            'status' => 'rejected',
        ]);
        $this->assertDatabaseMissing(User::class, [
            'email' => 'rejected@example.com',
        ]);
    }

    public function test_admin_can_approve_access_request_with_temporary_password(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $accessRequest = AccessRequest::create([
            'name' => 'New Writer',
            'email' => 'writer@example.com',
            'reason' => 'I would like to contribute.',
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.access-requests.update', $accessRequest), [
            'status' => 'approved',
            'role' => 'editor',
            'password' => 'password123',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas(User::class, [
            'email' => 'writer@example.com',
            'role' => 'editor',
        ]);
        $this->assertTrue(Hash::check('password123', User::where('email', 'writer@example.com')->value('password')));
    }

    public function test_admin_can_add_a_person_with_a_temporary_password(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'New Editor',
            'email' => 'new-editor@example.com',
            'role' => 'editor',
            'password' => 'password123',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas(User::class, [
            'email' => 'new-editor@example.com',
            'role' => 'editor',
        ]);
        $this->assertTrue(Hash::check('password123', User::where('email', 'new-editor@example.com')->value('password')));
    }

    public function test_admin_can_remove_editors_but_not_head_admins(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $editor = User::factory()->create(['role' => 'editor']);
        $headAdmin = User::factory()->create(['role' => 'head_admin']);

        $this->actingAs($admin)->delete(route('admin.users.destroy', $editor))->assertRedirect();
        $this->assertModelMissing($editor);

        $this->actingAs($admin)->delete(route('admin.users.destroy', $headAdmin))->assertForbidden();
        $this->assertModelExists($headAdmin);
    }
}
