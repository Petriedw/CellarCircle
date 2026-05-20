<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $headAdminEmail = env('HEAD_ADMIN_EMAIL', app()->environment('local') ? 'admin@cellarcircle.test' : null);
        $headAdminPassword = env('HEAD_ADMIN_PASSWORD', app()->environment('local') ? 'password' : null);

        if ($headAdminEmail && $headAdminPassword) {
            User::updateOrCreate(
                ['email' => $headAdminEmail],
                [
                    'name' => 'Cellar Circle Head Admin',
                    'role' => 'head_admin',
                    'password' => Hash::make($headAdminPassword),
                ],
            );
        }

        if (! app()->environment('local')) {
            return;
        }

        User::updateOrCreate(
            ['email' => 'admin@cellarcircle.test'],
            [
                'name' => 'Cellar Circle Head Admin',
                'role' => 'head_admin',
                'password' => Hash::make('password'),
            ],
        );

        User::updateOrCreate(
            ['email' => 'editor@cellarcircle.test'],
            [
                'name' => 'Cellar Editor',
                'role' => 'editor',
                'password' => Hash::make('password'),
            ],
        );
    }
}
