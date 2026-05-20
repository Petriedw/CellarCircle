<?php

namespace Tests\Feature\Auth;

use App\Models\AccessRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_is_not_available(): void
    {
        $response = $this->get('/register');

        $response->assertNotFound();
    }

    public function test_new_users_cannot_register_directly(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertGuest();
        $response->assertNotFound();
    }

    public function test_people_can_request_editor_access(): void
    {
        $response = $this->post('/access-requests', [
            'name' => 'Test Writer',
            'email' => 'writer@example.com',
            'reason' => 'I write careful stories about vineyards and cellar design.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas(AccessRequest::class, [
            'email' => 'writer@example.com',
            'status' => 'pending',
        ]);
    }
}
