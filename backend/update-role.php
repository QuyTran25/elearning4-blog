<?php
// File: update-role.php
// Chạy file này bằng: php update-role.php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$user = User::where('email', 'admin@example.com')->first();

if ($user) {
    $user->role = 'admin';
    $user->save();
    echo "✅ Updated user role to 'admin' successfully!\n";
    echo "User: {$user->name} ({$user->email})\n";
    echo "Role: {$user->role}\n";
} else {
    echo "❌ User not found!\n";
}
