<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moderation_users', function (Blueprint $table) {
            $table->string('username')->primary();
            $table->string('risk_level', 20)->default('LOW');
            $table->integer('violation_count')->default(0);
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('moderation_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comment_id')->nullable();
            $table->string('username')->nullable();
            $table->string('log_action', 50);
            $table->text('details')->nullable();
            $table->timestamp('logged_at')->useCurrent();

            $table->foreign('comment_id')->references('id')->on('comments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('moderation_logs');
        Schema::dropIfExists('moderation_users');
    }
};
