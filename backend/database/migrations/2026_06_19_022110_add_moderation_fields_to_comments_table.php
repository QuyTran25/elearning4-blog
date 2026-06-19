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
        Schema::table('comments', function (Blueprint $table) {
            $table->text('displayed_text')->nullable()->after('content');
            $table->string('mlp_label', 20)->nullable()->after('displayed_text');
            $table->decimal('mlp_confidence', 5, 4)->nullable()->after('mlp_label');
            $table->text('bad_words')->nullable()->after('mlp_confidence');
            $table->string('action', 30)->nullable()->after('bad_words');
            $table->string('status', 30)->default('posted')->after('action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn([
                'displayed_text',
                'mlp_label',
                'mlp_confidence',
                'bad_words',
                'action',
                'status',
            ]);
        });
    }
};
