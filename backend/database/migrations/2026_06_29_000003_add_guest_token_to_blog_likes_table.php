<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Xóa migration 003 này, vì 002 đã include guest_token
        // Bỏ qua nếu đã chạy rồi
    }

    public function down(): void
    {
        //
    }
};
